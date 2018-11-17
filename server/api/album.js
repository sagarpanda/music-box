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
  size: String
});

// create a schemaid, source, title, artist, hits, size
const albumSchema = new Schema({
  albumId: { type: String, unique: true },
  albumName: String,
  tracks: [musicTracksSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { strict: false });

const Model = mongoose.model('albums', albumSchema);


function addAlbums(req, res) {
  const records = req.body;
  // res.json({ body: record });
  Model.create(records, (err) => {
    if (!err) {
      res.json({
        data: records, status: true, errCode: '', errMsg: ''
      });
    } else {
      console.log(err.errmsg);
      res.json({
        status: false, errCode: err.code, errMsg: err.errmsg
      });
    }
  });
}

const album = {
  addAlbums
};

export default album;
