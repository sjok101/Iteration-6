var express = require('express');
const mongoose = require('mongoose');

var app = express();
var path = require('path');



//init view engine
app.set('view engine', 'ejs');

//set dir path
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////
//               Add routes here              //
////////////////////////////////////////////////

app.get('/ProducerPage', async function(req,res){
    res.render('');
})


//additional sandbox data
app.get('/', function (req, res) {
    res.render('index', {
        data: {
            fExplore: ['Explore1', 'Explore2', 'Explore3'],
            fExclusive: ['Exclusive1', 'Exclusive2', 'Exclusive3', 'Exclusive4'],
            fInfo: ['Info1', 'Info2', 'Info3', 'Info4'],
            fServ: ['Service1', 'Service2'],
            fHeader: ['Explore', 'Exclusives', 'Information', 'Services'],
            fExtra: ['Help', 'Privacy Policy', 'Terms of Use', 'Mission']
        }
    });
});
//------------------------------------------------------------------------------------- listner

//------------------------------------------------------------------------------------- DJ

const scheduleSchema = new mongoose.Schema({
    Djname: String,
    Date: String,
    Week: Number,
    DayNum: Number, 
    Time: String,
    playlistName: String,
    Playlists:[
      {
        title: String,
        artist: String,
        duration: String,
        genre: String,
        flag: String
      }
    ] 
  });

const schedule = mongoose.model('schedule', scheduleSchema);
const prevSchema = new mongoose.Schema({
    Name: String,
    description: String,
    Songs: [
      {
        title: String,
        artist: String,
        duration: String,
        genre: String,
        flag: String
      }
    ]
            
  });
const prevPlay = mongoose.model('prevPlay',prevSchema);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
// handle requests for static resources

let weekNumber = 1;
let currentTimeslot = {
  Date: "",
  Time: "",
  Playlist: [],
  Playlists: [],
  prevPlaylist: []
}
//home tab
app.get('/DJHomepage', async function(req, res) {
  const startWeek = await day.find({Week: weekNumber});
  startWeek.sort(compareWeek);
  //console.log(startWeek);
  res.render('pages/DJHomepage',{ThisWeek: startWeek});
});

app.post('/DJHomepage', async function(req, res) {
  if(req.body.page == 0) {
    console.log(req.body.WeekNum);
    if(req.body.WeekNum == 1 && weekNumber < 2) {
      weekNumber++;
    }
    else if(req.body.WeekNum == 0 && weekNumber > 0){
      weekNumber--;
    }
    else {
      console.log(weekNumber + " to high or low to move weeks currently");
    }
    console.log(weekNumber);
    let nweek = await day.find({Week: weekNumber});
    nweek.sort(compareWeek);
    res.send({ThisWeek: nweek});
  }
  else if(req.body.page == 1) {
    console.log(req.body.Date);
    console.log(req.body.Time);
    currentTimeslot.Date = req.body.Date;
    currentTimeslot.Time = req.body.Time;
    res.send({ThisDate: currentTimeslot.Date});
  }
});


//timeslot tab
app.get('/DJTimeSlot', async function(req, res) {
  //console.log("1: "+currentTimeslot.Date);
 // console.log("2: "+ Object.values(currentTimeslot) + " ok");
  let timeslotDay = await day.find({Date: currentTimeslot.Date});
  let timeslotDay1= timeslotDay[0];
  //console.log("3: "+ timeslotDay1);
  let timeslotDay2 = JSON.parse(JSON.stringify(timeslotDay1));
  currentTimeslot.Playlist = [];
  currentTimeslot.Playlists = [];
  for(let playlist of timeslotDay2.timeslots) {
    if(currentTimeslot.Time === playlist.Time) {
      for(let song of playlist.Playlists) {
        currentTimeslot.Playlist.push(song);
      }
      break;
    }
  }
  let playlists = await prevPlay.find();
  //console.log(playlists);
  for(let play of playlists) {
    //console.log(play);
    currentTimeslot.Playlists.push(play);
  } 
  res.render('pages/DJTimeSlot',{TimeSlot: currentTimeslot});
});

app.post('/DJTimeSlot', async function(req, res) {
  if(req.body.page == 1) {
    console.log(req.body.playName);
    let grabPlay = await prevPlay.find({Name: req.body.playName})
    let Playlistprev = grabPlay[0];
    let songs = JSON.parse(JSON.stringify(Playlistprev));
    currentTimeslot.prevPlaylist = songs.Songs;
    console.log(currentTimeslot.prevPlaylist);
    res.send({ThisPlay: grabPlay});
  }
  else if(req.body.page == 0) {
    console.log(req.body.index);
    console.log(currentTimeslot.Playlist[req.body.index]);
    currentTimeslot.Playlist[req.body.index].song = req.body.songName;
    currentTimeslot.Playlist[req.body.index].description = req.body.description;
    console.log(currentTimeslot.Playlist[req.body.index]);
    let timeslotDay = await day.find({Date: currentTimeslot.Date});
    let curDay = timeslotDay[0];
    let newTimeSlots = [];
    let i = 0;
    console.log(curDay.timeslots);
    for(let time of curDay.timeslots) {
      i = 0;
      if(time.Time == currentTimeslot.Time) {
        let newTime = time;
        for(let song of time.Playlists) {
          if(req.body.index == i) {
            song.song = req.body.songName;
            song.description = req.body.description;
            newTime.Playlists[i] = song;
            break;
          }
          i+=1;
        }
        newTimeSlots.push(newTime);
      }
      else {
        newTimeSlots.push(time);
      }
    }
    curDay.timeslots = newTimeSlots;
    let updatedTime = await day.updateOne({Date: curDay.Date}, curDay);
    console.log(updatedTime);
    res.send({ThisPlaylist: currentTimeslot.Playlist});
  }
});


//playlist tab
app.get('/DJPlaylist', async function(req, res) {
  console.log("here" + currentTimeslot.prevPlaylist);
  res.render('pages/DJPlaylist', {TPlaylists: currentTimeslot});
});

app.post('/DJPlaylist', async function(req, res) {
  if(req.body.page == 1) {
    currentTimeslot.Playlist = req.body.newPlaylist;
    let timeslotDay = await day.find({Date: currentTimeslot.Date});
    let curDay = timeslotDay[0];
    let newTimeSlots = [];
    for(let time of curDay.timeslots) {
      if(time.Time == currentTimeslot.Time) {
        time.Playlists = req.body.newPlaylist;
        newTimeSlots.push(time);
      }
      else {
        newTimeSlots.push(time);
      }
    }
    curDay.timeslots = newTimeSlots;
    let updatedTime = await day.updateOne({Date: curDay.Date}, curDay);
    console.log(updatedTime);
    const newprevplay = new prevPlay({
      Name: req.body.playName,
      description: req.body.playDescription,
      Songs: req.body.newPlaylist
    });
    newprevplay.save();
    res.send({ThisPlay: currentTimeslot.Playlist});
  }
  else if(req.body.page == 0) {
    currentTimeslot.Playlist = req.body.newPlaylist;
    let timeslotDay = await day.find({Date: currentTimeslot.Date});
    let curDay = timeslotDay[0];
    let newTimeSlots = [];
    for(let time of curDay.timeslots) {
      if(time.Time == currentTimeslot.Time) {
        time.Playlists = req.body.newPlaylist;
        newTimeSlots.push(time);
      }
      else {
        newTimeSlots.push(time);
      }
    }
    curDay.timeslots = newTimeSlots;
    let updatedTime = await day.updateOne({Date: curDay.Date}, curDay);
    console.log(updatedTime);
    res.send({ThisPlay: currentTimeslot.Playlist});
  }
});
//------------------------------------------------------------------------------------
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});