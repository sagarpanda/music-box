import Promise from 'bluebird';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import mongoose from 'mongoose';

const { ObjectID, Schema } = mongoose;

// create a schema
const schema = new Schema({
  id: String,
  idType: String, // filelist or download
  album: String,
  year: String,
  title: String,
  created_at: Date,
  updated_at: Date
}, { strict: false });

const Model = mongoose.model('songs', schema);
