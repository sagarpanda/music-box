import Promise from 'bluebird';
import mongoose from 'mongoose';

const { ObjectID, Schema } = mongoose;

// create a schemaid, source, title, artist, hits, size
const schema = new Schema({
  id: String,
  source: String,
  image: String,
  title: String,
  artist: String,
  hits: String,
  size: String,
  albumId: String,
  albumName: String,
  isPlaylist: { type: Boolean, default: false },
  isFavourite: { type: Boolean, default: false },
  isRecents: { type: Boolean, default: false },
  userId: String,
  created_at: Date,
  updated_at: Date
}, { strict: false });

const Model = mongoose.model('songs', schema);

function getUserId(req) {
  const { passport = {} } = req.session;
  const userId = passport.user ? passport.user.id : null;
  return userId;
}

/* ******** APIs ********* */

function getPlaylist(req, res) {
  const userId = getUserId(req);
  Model.find({ userId, isPlaylist: true }, { _id: 0, __v: 0 }, (err, records) => {
    res.json({
      data: records, status: true, errCode: '', errMsg: ''
    });
  });
}

function getFavourites(req, res) {
  const userId = getUserId(req);
  Model.find({ userId, isFavourite: true }, { _id: 0, __v: 0 }, (err, records) => {
    res.json({
      data: records, status: true, errCode: '', errMsg: ''
    });
  });
}

function getRecents(req, res) {
  const userId = getUserId(req);
  Model.find({ userId, isRecents: true }, { _id: 0, __v: 0 }, (err, records) => {
    res.json({
      data: records, status: true, errCode: '', errMsg: ''
    });
  });
}

function addToPlaylist(req, res) {
  const record = { ...req.body };
  record.created_at = new Date();
  record.isPlaylist = true;
  record.userId = getUserId(req);
  // const model = new Model(record);
  if (record.userId) {
    res.json({ body: record });
    /* model.save((err) => {
      if (!err) {
        res.json({
          data: req.body, status: true, errCode: '', errMsg: ''
        });
      } else {
        console.log(err.errmsg);
        res.json({
          status: false, errCode: err.code, errMsg: err.errmsg
        });
      }
    }); */
  } else {
    res.json({
      status: false, errCode: '', errMsg: ''
    });
  }
}

function updatePlaylist(req, res) {
  const records = req.body;
  res.json({
    data: records, status: true, errCode: '', errMsg: ''
  });
}

const song = {
  getPlaylist,
  getFavourites,
  getRecents,
  addToPlaylist,
  updatePlaylist
};

export default song;
