import express from 'express';
import mongoose from 'mongoose';
import webCrawler from './api/webCrawler';
import mainPage from './pages/mainPage';
import crawleTestPage from './pages/crawleTestPage';

mongoose.connect('mongodb://localhost/test');

const app = express();

// config
app.set('view engine', 'pug');
app.set('views', `${__dirname}/pages`);
app.use(express.static(`${__dirname}/public`));


app.get('/', mainPage);
app.get('/api/webCrawler/movies/:page', webCrawler.movies);
app.get('/api/webCrawler/movieSongs/:info', webCrawler.movieSongs);
app.get('/api/webCrawler/songDownloadLinks/:info', webCrawler.songDownloadLinks);


app.get('/test', crawleTestPage.test);
app.get('/list/:urlInfo', crawleTestPage.list);
app.get('/categorylist/:urlInfo', crawleTestPage.categorylist);
app.get('/filelist/:urlInfo', crawleTestPage.filelist);
app.get('/download/:urlInfo', crawleTestPage.download);

/* eslint-disable no-console */
app.listen(3001, () => console.log('Example app listening on port 3001!'));
