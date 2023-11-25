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
}, { timestamps: true });*/

const songSchema = new Schema({
    title: String,
    artist: String,
    duration: String,
    genre: String,
    flag: String
  });
const Song = mongoose.model('songs', songSchema);
module.exports = Song;