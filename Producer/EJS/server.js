var express = require('express');
const mongoose = require('mongoose');
const Song = require('./models/song');
const DJ = require('./models/dj');

//express app
var app = express();
var path = require('path');

//connect mongodb, then listen to requests
const mongoURI = 'mongodb+srv://bok:lK8drHQ5PMGJkIOg@clusterradio.grgdvff.mongodb.net/radiostation';

mongoose.connect(mongoURI)
    .then((result) => {
        console.log('Connected to MongoDB');
        app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
    })
    .catch((err) => console.log(err));

//sandbox routes. Example for Creation operations
app.get('/add-song', (req, res) => {
    const song = new Song({
        name: 'test song',
        artist: 'test artist',
        duration: '3:00'
    });
    song.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
        });
});

app.get('/all-songs', (req, res) => {
    DJ.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err)
        });

});



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

const bodyParser = require('body-parser');
app.use(bodyParser.json());
//Update
app.post('/addSong', async (req, res) => {
    try {
        console.log(req.body.name + "!!!")
        console.log(JSON.stringify(req.body, null, 2));
      // Logic to add a new item to MongoDB
      // Retrieve data from the request and save it to MongoDB
      const newSong = new Song(
        {name: req.body.name,
        artist: req.body.artist,
        duration: req.body.duration}
      );
      
      const djName = req.body.djName;
      const dj = await DJ.findOne({name:djName});

      if (!dj) {
        return res.status(404).json({ success: false, message: 'DJ not found' });
    }

    dj.songs.push(newSong)
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
  
      const dj = await DJ.findOne({ name: djName });
  
      if (!dj) {
        return res.status(404).json({ success: false, message: 'DJ not found' });
      }
  
      // Assuming songs is an array of objects
      const songIndex = dj.songs.findIndex(song => String(song._id) === songId);
  
      if (songIndex === -1) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }
  
      dj.songs.splice(songIndex, 1); // Remove the song at the found index
      await dj.save(); // Save the updated DJ document
  
      res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });



  

//init view engine
app.set('view engine', 'ejs');

//set dir path
app.use(express.static(path.join(__dirname, 'public')));

//additional sandbox data
app.get('/', function (req, res) {
    res.render('group3_bok', {
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

