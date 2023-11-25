const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/*
const songSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    }
});

const djSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    playlist: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    songs: [songSchema]
}, { timestamps: true });
*/
const djSchema = new mongoose.Schema({
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
const DJ = mongoose.model('djs', djSchema);
module.exports = DJ;