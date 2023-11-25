const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
module.exports = prevPlay;