var express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/radiostation');
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