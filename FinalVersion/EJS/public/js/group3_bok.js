document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM LOADED")
    try{
        const response = await fetchData('/getSongs');
        //const data = await response.json();
        uploadSongData(response);

        const response2 = await fetchData('/getDJs');
        //const data2 = await response2.json();
        uploadDJData(response2);
        mainBuild();
    } catch (err) {
        console.log(err);
    }
});


async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}. Status: ${response.status}`);
    }
    console.log(response);
    return response.json();
}


var staticSongsData
var staticDJ

function uploadSongData(data){
    console.log(data)
    staticSongsData = data;
}

function uploadDJData(data){
    console.log(data)
    staticDJ = data;
}


function mainBuild(){
/////////////////////////////////////////////////////////////////////////////
//                   Listener Approach (Futher used below)                 //
/////////////////////////////////////////////////////////////////////////////
alert("Make sure to select Oct 19 2023 as a date!")
const djList = document.querySelector(".dj-list")
const djPlayList = document.querySelector(".dj-playlist")
const musicSearch = document.querySelector(".music-search")
var gString;



djList.addEventListener("click", e => {
    console.log(e)
})

djPlayList.addEventListener("click", e => {
    console.log(e)
})

musicSearch.addEventListener("click", e => {
    console.log(e)
})


/////////////////////////////////////////////////////////////////////////////
//               Event types(input, keyup, click, )                        //
//               Form validation (buildMusicTable(), buildEmptyTableDJ)    //
//               Modifying DOM (returnList[], .innerHTML, .style)          //
//               Properties(returnList, newSongsData, filteredTable)       //
//Window Object(.querySelector, .createElement, .getElementsByTagName, dom)//
/////////////////////////////////////////////////////////////////////////////

//calendar event listener, listens for input
var dateField = document.querySelector('#DJ-Calendar');
dateField.addEventListener('input',
    function () {
        var date = dateField.value;
        console.log(date);
        console.log(staticDJ)
        // var filteredTable = filterDates(staticDJ, date);
        buildEmptyTableDJ(filterDates(staticDJ, date), djList, 15);

    })
//build table first to initialize it upon dom load
buildEmptyTableDJ([], djList, 15);
buildEmptyTablePlaylist([], djPlayList, 8);

//debug
//console.log(`${dateField.value}T00:00`)
//console.log(staticDJ[1].date)

//filters the dates and creates and returns a new list with it
function filterDates(data, value) {
    var returnList = [];
    for (var i = 0; i < data.length; i++) {
        let date = data[i].Date
        if (date.includes(value)) {
            returnList.push(data[i])
            console.log(data[i].Djname)
        }
    }
    return returnList;
}


//builds empty table for dj
function buildEmptyTableDJ(data, tableList, amountRow) {
    var table = tableList;
    table.innerHTML = `<tr>
                        <th>DJ</th>
                        <th>Playlist</th>
                        <th>Time slot</th>
                       </tr>`;

    for (var i = 0; i < amountRow; i++) {
        var savedTable;
        let row = document.createElement("tr");
        //if data is present, build dj table
        if (data[i] != null) {
            row.innerHTML = `<td>${data[i].Djname}</td>
                        <td>${data[i].playlistName}</td>
                        <td>${data[i].Time}</td>`;

            //add event listener to each row that is not null, and when clicked, build playlist table
            row.addEventListener("click", function () {
                var cells = this.getElementsByTagName("td");
                var content = cells[0].textContent;
                var index = -1;

                for (var j = 0; j < data.length; j++) {
                    if (data[j].Djname === content) {
                        index = j;
                        break;
                    }
                }

                console.log(index)
                console.log(data[index].Playlists)
                let newSongsData = data[index].Playlists;
                //add 2 new event listeners for add and del
                
                //add will add a highlighted song from search list and add it to newSongsData
                var addButton = document.querySelector("#add-to-play");
                
                addButton.addEventListener("click", async function () {
                    console.log("Yay!");
                    var highlightedSongIndex = getHighlightedIndex(musicSearch);
                    if (highlightedSongIndex !== -1) {
                        var highlightedSong = musicSearch.getElementsByTagName('tr')[highlightedSongIndex];
                        // console.log(highlightedSong)
                        var songData = getSongDataFromRow(highlightedSong);
                        newSongsData.push(songData);
                        console.log(songData.artist);
                        //Add song to mongodb
                        try {
                            const newSong = {
                                title: songData.title,
                                artist: songData.artist,
                                duration: songData.duration,
                                djName: content,
                            };
                        
                            const response = await fetch('/addSong', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newSong),
                            });
                        
                            if (response.ok) {
                                const result = await response.json();
                                console.log(result.message);
                            } else {
                                const errorResponse = await response.json().catch(() => ({})); // Catch potential JSON parsing errors
                                console.error('Failure to add song', response.status, errorResponse);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                        

                        savedTable=newSongsData
                        //staticDJ[index].songs.push(songData);
                        // Rebuild the DJ playlist table with the updated data
                        buildEmptyTablePlaylist(savedTable, djPlayList, newSongsData.length);
                        i=amountRow;
                    }

                })
                
                //del will delete a highlighted song from the playlist
                var delButton = document.querySelector('#del-from-play');
                delButton.addEventListener("click", async function (){
                    console.log("Nay!")
                    var highlightedSongIndex = getHighlightedIndex(djPlayList)
                    
                        // console.log(highlightedSong)
                   // var songData = getSongDataFromPlaylist(highlightedSong);
                    //console.log(highlightedSong.getElementsByTagName('tr')[0])
                    console.log(content + " Look at me")
                    var tempIndex = getIndex(staticDJ, content);
                    console.log(tempIndex)
                    console.log(highlightedSongIndex)
                    console.log(newSongsData[highlightedSongIndex-1]._id)
                    if(highlightedSongIndex !== -1){
                        var highlightedSong = djPlayList.getElementsByTagName('tr')[highlightedSongIndex];
                        var title = highlightedSong.getElementsByTagName('td')[0].textContent
                        console.log(title);
                        //work here and implement delete by sending a schema with songdata id and djName
                        try {
                            const dj_and_songID = {
                                djName: content,
                                songID: newSongsData[highlightedSongIndex-1]._id,

                            };
                            
                            const response = await fetch('/deleteSong', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(dj_and_songID)
                            });

                            if(response.ok) {
                                const data = await response.json();
                                console.log(data);
                            } else {
                                console.error('Error deleting item:', response.status, response.statusText);
                            }

                        } catch (error) {
                            console.error('Error', error);
                        }

                        newSongsData = newSongsData.filter(function(song){
                            console.log(song.title)
                            return song.title + " by " + song.artist !== title
                        })                        
                        savedTable = newSongsData
                        // console.log(newSongsData)
                        buildEmptyTablePlaylist(savedTable, djPlayList, newSongsData.length);
                        i=amountRow;
                    }

                })

                console.log(newSongsData +"Hello")

                if (savedTable==null){
                buildEmptyTablePlaylist(newSongsData, djPlayList, newSongsData.length);
                }
                else{
                    buildEmptyTablePlaylist(savedTable, djPlayList, newSongsData.length);
                }
            })
        }
        else {
            if (i == 0) {
                row.innerHTML = `<td></td>
            <td>Please choose a date</td>
            <td></td>`;
            } else {
                row.innerHTML = `<td></td>
            <td></td>
            <td></td>`;
            }

        }
        if (i % 2 == 0) {
            row.style.backgroundColor = "#72808a";
        }
        else {
            row.style.backgroundColor = "#575e66";
        }
        row.style.color = "Whitesmoke" //font color

        highlightRow(row, tableList)

        table.appendChild(row);
    }

}

function getIndex(staticData, target){

    for (var i = 0; i<staticData.length; i++){
        if(staticData[i].Djname==target){
            console.log(staticData[i].Djname + ' ok')
            return i
        }
    }
}

function getSongDataFromRow(target) {
    var targetTD = target.getElementsByTagName("td");
    for (var i = 0; i < staticSongsData.length; i++) {
        if (staticSongsData[i].title.includes(targetTD[0].textContent)) {
            console.log(staticSongsData[i].title)
            return staticSongsData[i]
        }
    }

}

function getSongDataFromPlaylist(target) {
    var targetTD = target.getElementsByTagName("td");
    for (var i = 0; i < staticDJ.length; i++) {
        if (staticDJ.Playlists[i].title.includes(targetTD[0].textContent)) {
            console.log(staticDJ.Playlists[i].title)
            return staticDJ.Playlists[i]
        }
    }

}

function getHighlightedIndex(tableList) {
    var rows = tableList.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var style = rows[i].getAttribute('style');

        //console.log(rows[i])
        if (style && style.toLowerCase().includes('background-color: blue')) {
            return i;
        }
    }


    return -1
}


function buildEmptyTablePlaylist(data, tableList, amountRow) {
    var table = tableList;
    table.innerHTML = `<tr>
                        <th>Title</th>
                        <th>Time Length</th>
                       </tr>`;

    for (var i = 0; i < amountRow; i++) {
        let row = document.createElement("tr");
        console.log("DEBUG: " + data)
        if (data[i] != null) {
            row.innerHTML = `<td>${data[i].title + " by " + data[i].artist}</td>
                        <td>${data[i].duration}</td>`;
        } else {
            row.innerHTML = `<td></td>
                            <td></td>`;

        }
        if (i % 2 == 0) {
            row.style.backgroundColor = "#72808a";
        }
        else {
            row.style.backgroundColor = "#575e66";
        }
        row.style.color = "Whitesmoke" //font color
        highlightRowPlaylist(row, tableList)

        table.appendChild(row);

    }
}


function highlightRowPlaylist(row, tableList) {

    var cells
    row.addEventListener("click", function () {
        var allRows = tableList.getElementsByTagName("tr");
        //Idea is to set default color, and then highlight at the end
        for (var j = 0; j < allRows.length; j++) {
            if (j % 2 == 0) {
                allRows[j].style.backgroundColor = "#575e66";
            }
            else {
                allRows[j].style.backgroundColor = "#72808a";
            }


        }

        //Highlight *this* row
        this.style.backgroundColor = "Blue";
        this.style.color = "whitesmoke";



        //Return data
        cells = this.getElementsByTagName("td");
        gString = cells[0].textContent + " " + cells[1].textContent;
        console.log("Highlight " + gString);

    })


}


function highlightRow(row, tableList) {

    row.addEventListener("click", function () {
        var allRows = tableList.getElementsByTagName("tr");
        //Idea is to set default color, and then highlight at the end
        for (var j = 0; j < allRows.length; j++) {
            if (j % 2 == 0) {
                allRows[j].style.backgroundColor = "#575e66";
            }
            else {
                allRows[j].style.backgroundColor = "#72808a";
            }


        }

        //Highlight *this* row
        this.style.backgroundColor = "Blue";
        this.style.color = "whitesmoke";

        //Return data
        var cells = this.getElementsByTagName("td");

        //console.log("Highlight " + cells[0].textContent + " " + cells[1].textContent);
    })


}

//This function will build a scrollable table according to its data and table structure
//songs rows are highlightable and returns meta data.
function buildMusicTable(data, tableList) {
    var table = tableList;

    table.innerHTML = `<thead>
                            <tr>
                                <th>Results</th>
                                <th>Artist</th>
                            </tr>
                        </thead>`;
    //populates table with data
    for (var i = 0; i < data.length; i++) {
        var row = document.createElement("tr");
        row.innerHTML = `<td>${data[i].title}</td>
                        <td>${data[i].artist}</td>`;

        //staggers coloration of rows
        if (i % 2 == 0) {
            row.style.backgroundColor = "#72808a";
        }
        else {
            row.style.backgroundColor = "#575e66";
        }
        row.style.color = "Whitesmoke" //font color

        //Add event listener for clicks to highlight row
        highlightRow(row, tableList);

        //Add the row to the table.
        table.appendChild(row);
    }
    //form validation check if no result
    if (data.length == 0) {
        var row = document.createElement("tr");
        row.innerHTML = `<td>No Results</td>
                        <td></td>`;
        row.style.backgroundColor = "#72808a";
        row.style.color = "Whitesmoke" //font color
        table.appendChild(row);
    }

}

function filterTable(value, tableData) {
    var returnList = [];

    for (var i = 0; i < tableData.length; i++) {
        value = value.toLowerCase();
        let title = tableData[i].title.toLowerCase();

        if (title.includes(value)) {
            returnList.push(tableData[i]);
            console.log(title)
            console.log(value)

        }
    }

    return returnList;
}
buildMusicTable(staticSongsData, musicSearch)

var searchType = document.querySelector(".search-bar"); //event type
searchType.addEventListener("keyup", e => {             //searches through list on keyup
    //console.log(searchType.value)
    let filteredTable = filterTable(searchType.value, staticSongsData);
    buildMusicTable(filteredTable, musicSearch)

})



var container = document.querySelector(".search-container");
container.style.height = "300px";
container.style.overflowY = "scroll";

container = document.querySelector(".dj-container");
container.style.height = "300px";
container.style.overflowY = "scroll";

}