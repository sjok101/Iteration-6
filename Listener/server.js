var express = require('express');
var app = express();
const path = require('path');
const mongoose = require("mongoose");
var bodyParser = require('body-parser')

// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())

app.use(express.static(__dirname+'/public'));

mongoose.connect('mongodb+srv://username:PassWord@cluster0.0jxtibh.mongodb.net/');

const aaaSchema = {
  
        firstName: String,
        lastName: String,
        dob:String,
        email: String,
        phoneNum:String
    
};

const AAA = mongoose.model('aaas', aaaSchema);


const songSchema = {
  title: String,
  artist: String,
  duration: String,
  genre: String,
  flag:String
}

const Songs = mongoose.model('song', songSchema);





// main page
app.get('/listener_main', async function(req, res) {
  const songs = await Songs.find()
  res.render('pages/listener_main', {music: songs});
});
app.post('/listener_main', async function(req, res) {
  
  if(req.body.search){

    const keyword = req.body.search;
    const filter = {"artist":keyword};
    const results = await Songs.find(filter);
    if(results.length == 0){
      results.push({artist: 'NOT', title: "FOUND"});
    }
    
    res.render('pages/listener_music', {data: results});
   
  }
  else{
    const updated = req.body;
  const filter = {"_id":updated._id};
  let updatedUser = await Songs.findOneAndUpdate(filter, updated);
  const songs = await Songs.find()
  res.render('pages/listener_main', {music: songs});
  }
 
});





app.get('/listener_profile', async function(req, res) {
  const data = await AAA.find();

  res.render('pages/listener_profile', {user: data});
 
});
app.post('/listener_profile', async function(req, res) {
  const updated = req.body;
  const filter = {"_id":updated._id};
  let updatedUser = await AAA.findOneAndUpdate(filter, updated);
  res.render('pages/listener_profile', {user: updatedUser});
});





app.listen(8080);
console.log('Server is listening on port 8080');