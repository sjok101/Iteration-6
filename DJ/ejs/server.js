const path = require('path');
const express = require('express');
// create an express app
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/DJ');
const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to mongo');
});

const daySchema = new mongoose.Schema({
  Date: String,
  Week: Number,
  DayNum: Number,
  timeslots:[
    {
      Time: String,
      Playlists:[
        {
          song: String,
          description: String
        }
      ] 
    }
  ]
});
const prevSchema = new mongoose.Schema({
  Name: String,
  description: String,
  Songs: [
    {
      song: String,
      description: String,
    }
  ]
          
});
const day = mongoose.model('day', daySchema);
/*
const day1 = new day({
  Date: "October 1st 2023",
  Week: 1,
  DayNum: 1,
  timeslots:[
    {
      Time: "9:00am",
      Playlists:[
        {
            song: "WOW SONG",
            description: "wow that a song",
        },
        {
            song: "thats crazy",
            description: "coco",
        },
        {
            song: "lofi1",
            description: "lofi song",
        },
        {
            song: "WOW SONG2",
            description: "wow that a song2",
        },
        {
            song: "like that",
            description: "by josh smith and genre: pop",
        },
        {
            song: "sunset lover",
            description: "by biscuit and great for sunsets",
        }
      ]
    },
    {
      Time: "10:00am",
      Playlists:[
        {
            song: "night song",
            description: "night time song",
        },
        {
            song: "thats crazy",
            description: "coco",
        },
        {
            song: "lofi1",
            description: "lofi song",
        },
        {
            song: "WOW SONG2",
            description: "wow that a song2",
        },
        {
            song: "like that",
            description: "by josh smith and genre: pop",
        },
        {
            song: "sunset lover",
            description: "by biscuit and great for sunsets",
        }
      ]
    },
    {
      Time: "1:00pm",
      Playlists:[
        {
            song: "WOW SONG",
            description: "wow that a song",
        },
        {
            song: "thats crazy",
            description: "coco",
        },
        {
            song: "lofi1",
            description: "lofi song",
        },
        {
            song: "WOW SONG2",
            description: "wow that a song2",
        },
        {
            song: "like that",
            description: "by josh smith and genre: pop",
        },
        {
            song: "sunset lover",
            description: "by biscuit and great for sunsets",
        }
      ]
    },
    {
      Time: "3:00pm",
      Playlists:[
        {
            song: "WOW SONG",
            description: "wow that a song",
        },
        {
            song: "thats crazy",
            description: "coco",
        },
        {
            song: "lofi1",
            description: "lofi song",
        },
        {
            song: "WOW SONG2",
            description: "wow that a song2",
        },
        {
            song: "like that",
            description: "by josh smith and genre: pop",
        },
        {
            song: "sunset lover",
            description: "by biscuit and great for sunsets",
        }
      ]
    }
  ]
});
const day2 = new day({
  Date: "October 2nd 2023",
  Week: 1,
  DayNum: 2,
  timeslots: [
    {
      Time: "9:00pm",
      Playlists:[
        {
            song: "meh SONG",
            description: "meh that a song",
        },
        {
            song: "thats not crazy",
            description: "not coco",
        },
        {
            song: "lofi55555",
            description: "lofi song",
        },
        {
            song: "WOW SONG2",
            description: "wow that a song2",
        },
        {
            song: "like that",
            description: "by josh smith and genre: pop",
        },
        {
            song: "sunset lover",
            description: "by biscuit and great for sunsets",
        }
      ]
    }
  ]
});
  const day3 = new day({
    Date: "October 3rd 2023",
    Week: 1,
    DayNum: 3,
    timeslots: [
      {
        Time: "12:00pm",
        Playlists:[
          {
              song: "WOW SONG",
              description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day4 = new day({
    Date: "October 4th 2023",
    Week: 1,
    DayNum: 4,
    timeslots: [
      {
        Time: "4:30pm",
        Playlists:[
          {
              song: "WOW SONG",
              description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day5 = new day({
    Date: "October 5th 2023",
    Week: 1,
    DayNum: 5,
    timeslots: [
      {
        Time: "10:00pm",
        Playlists:[
          {
              song: "WOW SONG",
              description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day6 = new day({
    Date: "October 6th 2023",
    Week: 1,
    DayNum: 6,
    timeslots: [
      {
        Time: "8:00am",
        Playlists:[
          {
              song: "WOW SONG",
              description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day7 = new day({
    Date: "October 7th 2023",
    Week: 1,
    DayNum: 7,
    timeslots: [
      {
        Time: "8:00pm",
        Playlists:[
          {
              song: "WOW SONG",
              description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day8 = new day({
    Date: "October 8th 2023",
    Week: 2,
    DayNum: 1,
    timeslots: [
      {
        Time: "11:30am",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      },
      {
        Time: "1:00pm",
        Playlists:[
          {
              SongName: "WOW SONG",
              SongDescription: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      },
      {
        Time: "3:00pm",
        Playlists:[
          {
              SongName: "WOW SONG",
              SongDescription: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day9 = new day({
    Date: "October 9th 2023",
    Week: 2,
    DayNum: 2,
    timeslots: [
      {
        Time: "1:00am",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day10 = new day({
    Date: "October 10th 2023",
    Week: 2,
    DayNum: 3,
    timeslots: [
      {
        Time: "11:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day11 = new day({
    Date: "October 11th 2023",
    Week: 2,
    DayNum: 4,
    timeslots: [
      {
        Time: "5:00am",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day12 = new day({
    Date: "October 12th 2023",
    Week: 2,
    DayNum: 5,
    timeslots: [
      {
        Time: "5:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day13 = new day({
    Date: "October 13th 2023",
    Week: 2,
    DayNum: 6,
    timeslots: [
      {
        Time: "7:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day14 = new day({
    Date: "October 14th 2023",
    Week: 2,
    DayNum: 7,
    timeslots: [
      {
        Time: "7:30pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day15 = new day({
    Date: "September 24th 2023",
    Week: 0,
    DayNum: 1,
    timeslots: [
      {
        Time: "9:30am",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      },
      {
        Time: "2:00pm",
        Playlists:[
          {
              SongName: "WOW SONG",
              SongDescription: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      },
      {
        Time: "4:00pm",
        Playlists:[
          {
              SongName: "WOW SONG",
              SongDescription: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day16 = new day({
    Date: "September 25th 2023",
    Week: 0,
    DayNum: 2,
    timeslots: [
      {
        Time: "11:00am",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day17 = new day({
    Date: "September 26th 2023",
    Week: 0,
    DayNum: 3,
    timeslots: [
      {
        Time: "10:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day18 = new day({
    Date: "September 27th 2023",
    Week: 0,
    DayNum:4,
    timeslots: [
      {
        Time: "10:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day19 = new day({
    Date: "September 28th 2023",
    Week: 0,
    DayNum: 5,
    timeslots: [
      {
        Time: "9:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day20 = new day({
    Date: "September 29th 2023",
    Week: 0,
    DayNum: 6,
    timeslots: [
      {
        Time: "12:00am",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });
  const day21 = new day({
    Date: "September 30th 2023",
    Week: 0,
    DayNum: 7,
    timeslots: [
      {
        Time: "6:00pm",
        Playlists:[
          {
            song: "WOW SONG",
            description: "wow that a song",
          },
          {
              song: "thats crazy",
              description: "coco",
          },
          {
              song: "lofi1",
              description: "lofi song",
          },
          {
              song: "WOW SONG2",
              description: "wow that a song2",
          },
          {
              song: "like that",
              description: "by josh smith and genre: pop",
          },
          {
              song: "sunset lover",
              description: "by biscuit and great for sunsets",
          }
        ]
      }
    ]
  });

day1.save();
day2.save();
day3.save();
day4.save();
day5.save();
day6.save();
day7.save();
day8.save();
day9.save();
day10.save();
day11.save();
day12.save();
day13.save();
day14.save();
day15.save();
day16.save();
day17.save();
day18.save();
day19.save();
day20.save();
day21.save();
*/
const prevPlay = mongoose.model('prevPlay',prevSchema);
/*
const prev1 = new prevPlay({
  Name: "summer playlist",
  description: "summer relaxer",
  Songs: [
    {
        song: "lost within",
        description: "footbal yay",
    },
    {
        song: "blue boi",
        description: "futball ayy",
    },
    {
        song: "lofi1",
        description: "lofi song",
    },
    {
        song: "lofi2",
        description: "lofi song",
    },
    {
        song: "lofi3",
        description: "lofi song",
    },
    {
        song: "lofi4",
        description: "lofi song",
    },
    {
        song: "WOW SONG25",
        description: "wow that a song too many",
    },
    {
        song: "in my dreams",
        description: "by george washingtion",
    },
    {
        song: "lover of sunsets",
        description: "sun falling down",
    }]
});
const prev2 = new prevPlay({
  Name: "new year playlist",
  description: "to start off the year",
  Songs: [
    {
        song: "lost within",
        description: "footbal yay",
    },
    {
        song: "blue boi",
        description: "futball ayy",
    },
    {
        song: "lofi1",
        description: "lofi song",
    },
    {
        song: "lofi2",
        description: "lofi song",
    },
    {
        song: "lofi3",
        description: "lofi song",
    },
    {
        song: "lofi4",
        description: "lofi song",
    },
    {
        song: "WOW SONG25",
        description: "wow that a song too many",
    },
    {
        song: "in my dreams",
        description: "by george washingtion",
    },
    {
        song: "lover of sunsets",
        description: "sun falling down",
    }]
});
const prev3 = new prevPlay({
  Name: "Playlist 1st",
  description: "first try",
  Songs: [
    {
        song: "lost within",
        description: "footbal yay",
    },
    {
        song: "blue boi",
        description: "futball ayy",
    },
    {
        song: "lofi1",
        description: "lofi song",
    },
    {
        song: "lofi2",
        description: "lofi song",
    },
    {
        song: "lofi3",
        description: "lofi song",
    },
    {
        song: "lofi4",
        description: "lofi song",
    },
    {
        song: "WOW SONG25",
        description: "wow that a song too many",
    },
    {
        song: "in my dreams",
        description: "by george washingtion",
    },
    {
        song: "lover of sunsets",
        description: "sun falling down",
    }]
});
const prev4 = new prevPlay({
  Name: "lofi playlist",
  description: "lofi songs",
  Songs: [
    {
        song: "lost within",
        description: "footbal yay",
    },
    {
        song: "blue boi",
        description: "futball ayy",
    },
    {
        song: "lofi1",
        description: "lofi song",
    },
    {
        song: "lofi2",
        description: "lofi song",
    },
    {
        song: "lofi3",
        description: "lofi song",
    },
    {
        song: "lofi4",
        description: "lofi song",
    },
    {
        song: "WOW SONG25",
        description: "wow that a song too many",
    },
    {
        song: "in my dreams",
        description: "by george washingtion",
    },
    {
        song: "lover of sunsets",
        description: "sun falling down",
    }]
});
const prev5 = new prevPlay({
  Name: "Playlist halloween",
  description: "scary",
  Songs: [
    {
        song: "lost within",
        description: "footbal yay",
    },
    {
        song: "blue boi",
        description: "futball ayy",
    },
    {
        song: "lofi1",
        description: "lofi song",
    },
    {
        song: "lofi2",
        description: "lofi song",
    },
    {
        song: "lofi3",
        description: "lofi song",
    },
    {
        song: "lofi4",
        description: "lofi song",
    },
    {
        song: "WOW SONG25",
        description: "wow that a song too many",
    },
    {
        song: "in my dreams",
        description: "by george washingtion",
    },
    {
        song: "lover of sunsets",
        description: "sun falling down",
    }]
});
const prev6 = new prevPlay({
  Name: "Playlist christmas",
  description: "jolly jolly christmas",
  Songs: [
    {
        song: "lost within",
        description: "footbal yay",
    },
    {
        song: "blue boi",
        description: "futball ayy",
    },
    {
        song: "lofi1",
        description: "lofi song",
    },
    {
        song: "lofi2",
        description: "lofi song",
    },
    {
        song: "lofi3",
        description: "lofi song",
    },
    {
        song: "lofi4",
        description: "lofi song",
    },
    {
        song: "WOW SONG25",
        description: "wow that a song too many",
    },
    {
        song: "in my dreams",
        description: "by george washingtion",
    },
    {
        song: "lover of sunsets",
        description: "sun falling down",
    }]
});
prev1.save();
prev2.save();
prev3.save();
prev4.save();
prev5.save();
prev6.save();
*/

app.set('view engine','ejs');
// tell node to use json and HTTP header features in body-parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// handle requests for static resources

app.use(express.static(__dirname+'/public'));

app.get('/DJStyle.css', async function(req, res) {
  res.sendFile(__dirname + "/pages/DJStyle.css");
});
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

// Use express to listen to port
let port = 8080;
app.listen(port, () => {
    console.log("Server running at port= " + port);
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