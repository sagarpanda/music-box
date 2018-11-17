import Promise from 'bluebird';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const musicTracksSchema = new Schema({
  trackId: String,
  source: String,
  image: String,
  title: String,
  artist: String,
  hits: String,
  size: String,
  albumId: String,
  albumName: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// create a schemaid, source, title, artist, hits, size
const userSchema = new Schema({
  userId: { type: String, unique: true },
  displayName: String,
  provider: String,
  playlist: [musicTracksSchema],
  recents: [musicTracksSchema],
  favorites: [musicTracksSchema]
}, { strict: false });

const Model = mongoose.model('users', userSchema);


function getUserId(req) {
  const { passport = {} } = req.session;
  const userId = passport.user ? passport.user.id : null;
  return userId;
}


/* ******** APIs ********* */

function findOrCreate(profile) {
  const ob = { userId: profile.id, provider: profile.provider, displayName: profile.displayName };
  return new Promise((resolve) => {
    Model.findOne({ userId: ob.userId }, (err, user) => {
      if (!err) {
        if (user) {
          resolve(ob);
        } else {
          Model(ob).save((error) => {
            if (!error) {
              resolve(ob);
            }
          });
        }
      }
    });
  });
}

function getPlaylist(req, res) {
  const userId = getUserId(req);
  Model.find({ userId }, { _id: 0, __v: 0 }, (err, records) => {
    const playlist = (records[0] && records[0].playlist) ? records[0].playlist : [];
    res.json({
      data: playlist, status: true, errCode: '', errMsg: ''
    });
  });
}

function getRecents(req, res) {
  const userId = getUserId(req);
  Model.find({ userId, isRecents: true }, { _id: 0, __v: 0 }, (err, records) => {
    const recents = (records[0] && records[0].recents) ? records[0].recents : [];
    res.json({
      data: recents, status: true, errCode: '', errMsg: ''
    });
  });
}

function addToPlaylist(req, res) {
  const record = req.body;
  const userId = getUserId(req);
  if (userId) {
    // res.json({ body: record });
    Model.updateOne({ userId }, { $push: { playlist: record } }, (err) => {
      if (!err) {
        res.json({
          data: record, status: true, errCode: '', errMsg: ''
        });
      } else {
        console.log(err.errmsg);
        res.status(400).json({
          status: false, errCode: err.code, errMsg: err.errmsg
        });
      }
    });
  } else {
    res.json({
      status: false, errCode: '', errMsg: ''
    });
  }
}

function getFavourites(req, res) {
  const userId = getUserId(req);
  Model.find({ userId }, { _id: 0, __v: 0 }, (err, records) => {
    const favorites = (records[0] && records[0].favorites) ? records[0].favorites : [];
    res.json({
      body: favorites, status: true, errCode: '', errMsg: ''
    });
  });
}

function addFavorite(req, res) {
  const track = req.body;
  const userId = getUserId(req);
  if (userId) {
    // res.json({ body: record });
    Model.updateOne({ userId }, { $push: { favorites: track } }, (err) => {
      if (!err) {
        res.json({
          data: track, status: true, errCode: '', errMsg: ''
        });
      } else {
        console.log(err.errmsg);
        res.status(400).json({
          status: false, errCode: err.code, errMsg: err.errmsg
        });
      }
    });
  } else {
    res.json({
      status: false, errCode: '', errMsg: ''
    });
  }
}

function removeFavorite(req, res) {
  const { trackId } = req.body;
  const userId = getUserId(req);
  if (userId) {
    Model.updateOne({ userId }, { $pull: { favorites: { trackId } } }, (err) => {
      if (!err) {
        res.json({
          data: trackId, status: true, errCode: '', errMsg: ''
        });
      } else {
        console.log(err.errmsg);
        res.status(400).json({
          status: false, errCode: err.code, errMsg: err.errmsg
        });
      }
    });
  } else {
    res.json({
      status: false, errCode: '', errMsg: ''
    });
  }
}

function updatePlaylist(req, res) {
  const { tracks } = req.body;
  res.json({
    data: tracks, status: true, errCode: '', errMsg: ''
  });
}

const user = {
  model: Model,
  findOrCreate,
  getPlaylist,
  getFavourites,
  getRecents,
  addToPlaylist,
  updatePlaylist,
  addFavorite,
  removeFavorite
};

export default user;
