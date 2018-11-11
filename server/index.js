import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import webCrawler from './api/webCrawler';
import mainPage from './pages/mainPage';
import crawleTestPage from './pages/crawleTestPage';

mongoose.connect(config.DB_CON, { useNewUrlParser: true });

const app = express();
// const publicDir = path.resolve(`./../${config.PUBLIC_DIR}`);
const publicDir = path.resolve(__dirname, `../${config.PUBLIC_DIR}`);
const viewDir = path.resolve(__dirname, 'pages');

// config
app.set('view engine', 'pug');
app.set('views', viewDir);
app.use(express.static(publicDir));

app.use((request, response, next) => {
  const basePath = request.url.split('/')[1];
  if (basePath === 'api') {
    const keys = Object.keys(config.API_HEAD);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      response.setHeader(key, config.API_HEAD[key]);
    }
  }
  next();
});

app.get('/', mainPage);
app.get('/api/xtpull/movies/:page', webCrawler.movies);
app.get('/api/xtpull/movieSongs/:info', webCrawler.movieSongs);
app.get('/api/xtpull/songDownloadLinks/:info', webCrawler.songDownloadLinks);


app.get('/test', crawleTestPage.test);
app.get('/list/:urlInfo', crawleTestPage.list);
app.get('/categorylist/:urlInfo', crawleTestPage.categorylist);
app.get('/filelist/:urlInfo', crawleTestPage.filelist);
app.get('/download/:urlInfo', crawleTestPage.download);

/* eslint-disable no-console */
app.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}!`));
