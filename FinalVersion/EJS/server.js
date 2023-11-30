var express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://username:PassWord@cluster0.0jxtibh.mongodb.net/');
const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to mongo');
});
const Song = require('./models/song');
const DJ = require('./models/dj');
const prevPlay = require('./models/prevPlaylist');
const AAA = require('./models/aaa');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');


//init view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//set dir path
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////
//               Add routes here              //
////////////////////////////////////////////////

//------------------------------------------------------------------------------------- producer


//Current Usable Routes
//Songs should be able to be Read
app.get('/getSongs', async (req, res) => {
  Song.find()
      .then((result) => {
          res.send(result);
      })
      .catch((err) => {
          console.log(err)
      });
});


//DJ's should be able to be Read, Updated, and Deleted for their list of songs
//Read
app.get('/getDJs', async (req, res) => {
  DJ.find()
      .then((result) => {
          res.send(result);
      })
      .catch((err) => {
          console.log(err)
      });
});


//Update
app.post('/addSong', async (req, res) => {
  try {
      console.log(req.body.title + "!!!")
      console.log(JSON.stringify(req.body, null, 2));
    // Logic to add a new item to MongoDB
    // Retrieve data from the request and save it to MongoDB
    const newSong = new Song(
      {title: req.body.title,
      artist: req.body.artist,
      duration: req.body.duration}
    );
    
    const djName = req.body.djName;
    const dj = await DJ.findOne({Djname:djName});
    console.log(dj)
    if (!dj) {
      return res.status(404).json({ success: false, message: 'DJ not found' });
  }

  dj.Playlists.push(newSong)
  await dj.save();

    
    res.json({ success: true, message: 'Song added successfully' });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//Delete
app.post('/deleteSong', async (req, res) => {
  try {
    const songId = req.body.songID;
    const djName = req.body.djName;
    const dj = await DJ.findOne({ Djname: djName });
    
    if (!dj) {
      return res.status(404).json({ success: false, message: 'DJ not found' });
    }
    
    // Assuming songs is an array of objects
    const songIndex = dj.Playlists.findIndex(song => String(song._id) === songId);
   // console.log("this is delete" + songId + djName + " " +songIndex)

    if (songIndex === -1) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    dj.Playlists.splice(songIndex, 1); // Remove the song at the found index
    await dj.save(); // Save the updated DJ document

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



//DJ's should be able to be Read, Updated, and Deleted for their list of songs
//Read
app.get('/getDJs', async (req, res) => {
  DJ.find()
      .then((result) => {
          res.send(result);
      })
      .catch((err) => {
          console.log(err)
      });
});



app.get('/ProducerPage', async function(req,res){
    res.render('pages/group3_bok', {
      data: {
          fExplore: ['Explore1', 'Explore2', 'Explore3'],
          fExclusive: ['Exclusive1', 'Exclusive2', 'Exclusive3', 'Exclusive4'],
          fInfo: ['Info1', 'Info2', 'Info3', 'Info4'],
          fServ: ['Service1', 'Service2'],
          fHeader: ['Explore', 'Exclusives', 'Information', 'Services'],
          fExtra: ['Help', 'Privacy Policy', 'Terms of Use', 'Mission']
      }
  });
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
const referencSchema= new mongoose.Schema({ref:String, bool:String});
const References = mongoose.model('refs', referencSchema);

// main page
app.get('/listener_main', async function(req, res) {
  
  let array = []
  const reff = await References.find({"bool": "1"}, {ref:1, _id:0})
  reff.forEach((element) => array = array.concat(Object.values(Object.values(element)[2]))) 
  const first = reff[0]


  const playlist = await DJ.find({"Playlists.artist": {$in:array}})
  const songs = await Song.find()
  const artists = await References.find()

  // res.render('pages/listener_main', {music: empty});
  res.render('pages/listener_main', {music: songs, reference:artists, playlist: playlist});
});
app.post('/listener_main', async function(req, res) {
  
  if(req.body.search){

    const keyword = req.body.search;
    const filter = {"artist":keyword};
    const results = await Song.find(filter);
    if(results.length == 0){
      results.push({artist: 'NOT', title: "FOUND"});
    }
    // res.render('pages/listener_music', {data: epty});
    res.render('pages/listener_music', {data: results});
   
  }
  if(req.body.ref){
    const updated = req.body;
    const filter = {"ref":updated.ref};
    
    const inserted = await References.findOneAndUpdate(filter, updated);
    const songs = await Song.find()
    const artists = await References.find()

    let array = []
    const reff = await References.find({"bool": "1"}, {ref:1, _id:0})
    reff.forEach((element) => array = array.concat(Object.values(Object.values(element)[2]))) 
    

    const playlist = await DJ.find({"Playlists.artist": {$in:array}})
    
    // res.render('pages/listener_main', {music: epty});
    res.render('pages/listener_main', {music: songs, reference:artists, playlist: playlist});

  }
  else{
    const updated = req.body;
    
  const filter = {"_id":updated._id};
  let updatedUser = await Song.findOneAndUpdate(filter, updated);
  const songs = await Song.find()
  const artists = await References.find()

  let array = []
    const reff = await References.find({"bool": "1"}, {ref:1, _id:0})
    reff.forEach((element) => array = array.concat(Object.values(Object.values(element)[2]))) 
    

    const playlist = await DJ.find({"Playlists.artist": {$in:array}})
    
    // res.render('pages/listener_main', {music: epty});
    res.render('pages/listener_main', {music: songs, reference:artists, playlist: playlist});
  }
 
});





app.get('/listener_profile', async function(req, res) {
  const data = await AAA.find();

  // res.render('pages/listener_profile', {user: empty});
  res.render('pages/listener_profile', {user: data});
 
});
app.post('/listener_profile', async function(req, res) {
  const updated = req.body;
  const filter = {"_id":updated._id};
  let updatedUser = await AAA.findOneAndUpdate(filter, updated);
  // res.render('pages/listener_profile', {user: empty});
  res.render('pages/listener_profile', {user: updatedUser});
});
//------------------------------------------------------------------------------------- DJ


let weekNumber = 47;
let currentTimeslot = {
  Date: "",
  Time: "",
  Playlist: [],
  Playlists: [],
  prevPlaylist: []
}
//home tab
app.get('/DJHomepage', async function(req, res) {
  //console.log("here");
  const startWeek = await DJ.find({Week: weekNumber});
  //console.log(startWeek);
  startWeek.sort(compareWeek);
  //console.log(startWeek);
  res.render('pages/DJHomepage',{ThisWeek: startWeek});
});

app.post('/DJHomepage', async function(req, res) {
  if(req.body.page == 0) {
    let temp = weekNumber;
    weekNumber =req.body.WeekNum;
    console.log(weekNumber);
    let nweek = await DJ.find({Week: weekNumber});
    if(nweek.length == 0) {
      weekNumber = temp;
      nweek = await DJ.find({Week: weekNumber});
    }
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
  //console.log("2: "+ Object.values(currentTimeslot) + " ok");
  //console.log("here ----------------------------------------")
  let timeslotDay = await DJ.find({Date: currentTimeslot.Date, Time: currentTimeslot.Time});
  //console.log(timeslotDay);
  let timeslotDay1= timeslotDay[0];
  //console.log(timeslotDay1);
  //console.log("3: "+ timeslotDay1);
  let timeslotDay2 = JSON.parse(JSON.stringify(timeslotDay1));
  console.log(timeslotDay2);
  currentTimeslot.Playlist = [];
  currentTimeslot.Playlists = [];
  for(let song of timeslotDay2.Playlists) {
    currentTimeslot.Playlist.push(song);
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
});


//playlist tab
app.get('/DJPlaylist', async function(req, res) {
  console.log("here" + currentTimeslot.prevPlaylist);
  res.render('pages/DJPlaylist', {TPlaylists: currentTimeslot});
});

app.post('/DJPlaylist', async function(req, res) {
  if(req.body.page == 1) {
    currentTimeslot.Playlist = req.body.newPlaylist;
    let timeslotDay = await DJ.find({Date: currentTimeslot.Date,Time: currentTimeslot.Time});
    console.log(timeslotDay);
    let curDay= timeslotDay[0];
    console.log(curDay);
    /*let newPlaylist = [];
    for(let song of currentTimeslot.Playlist) {
      console.log(song);
      console.log(" -------------");
      newPlaylist.push(song);
    }*/
    curDay.Playlists = currentTimeslot.Playlist;
    let updatedTime = await DJ.updateOne({Date: curDay.Date,Time:curDay.Time}, curDay);
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
    let timeslotDay = await DJ.find({Date: currentTimeslot.Date,Time: currentTimeslot.Time});
    console.log(timeslotDay);
    let curDay= timeslotDay[0];
    console.log(curDay);
    curDay.Playlists = currentTimeslot.Playlist;
    let updatedTime = await DJ.updateOne({Date: curDay.Date,Time:curDay.Time}, curDay);
    console.log(updatedTime);
    res.send({ThisPlay: currentTimeslot.Playlist});
  }
});

function compareWeek(day1, day2) {
    if(day1.DayNum < day2.DayNum) {
      return -1;
    }
    else if(day1.DayNum > day2.DayNum) {
      return 1;
    }
    else {
      return 0;
    }  
  }
//------------------------------------------------------------------------------------
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});