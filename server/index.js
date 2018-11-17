import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import facebook from 'passport-facebook';
import config from './config';
import webCrawlerAPI from './api/webCrawler';
import userAPI from './api/user';
import mainPage from './pages/mainPage';
import crawleTestPage from './pages/crawleTestPage';

const MongoStore = connectMongo(session);
mongoose.connect(config.DB_CON, { useNewUrlParser: true });

const app = express();
const publicDir = path.resolve(__dirname, `../${config.PUBLIC_DIR}`);
const viewDir = path.resolve(__dirname, 'pages');


/** **** Middleware ****** */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', viewDir);
app.use(express.static(publicDir));
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000000 },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// API header set to avoid cross-origin
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

function authorize(req, res, next) {
  const { passport: pass = {} } = req.session;
  const userId = pass.user ? pass.user.id : null;
  if (userId) {
    next();
  } else {
    // res.redirect('/');
    res.status(401).json({});
  }
}

/** **** facebook OAuth ****** */
const FacebookStrategy = facebook.Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy(
  {
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // console.log('accessToken', accessToken, refreshToken, profile, done);
    userAPI.findOrCreate(profile).then(() => {
      done(null, { id: profile.id, provider: profile.provider, displayName: profile.displayName });
    });
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
/** **** facebook OAuth End ****** */

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/'); // Inside a callback… bulletproof!
  });
});

app.route('/app').all(authorize).get(mainPage);

app.get('/', mainPage);
app.get('/album', mainPage);
app.get('/playlist', mainPage);
app.get('/favorites', mainPage);
app.get('/recents', mainPage);
app.get('/api/xtpull/movies/:page', webCrawlerAPI.movies);
app.get('/api/xtpull/movieSongs/:info', webCrawlerAPI.movieSongs);
app.get('/api/xtpull/songDownloadLinks/:info', webCrawlerAPI.songDownloadLinks);

// app.route('/api/user/playlist').all(authorize).post(userAPI.addToPlaylist);
app.route('/api/user/favorite').all(authorize).get(userAPI.getFavourites);
app.route('/api/user/favorite').all(authorize).post(userAPI.addFavorite);
app.route('/api/user/favorite').all(authorize).delete(userAPI.removeFavorite);

app.get('/test', crawleTestPage.test);
app.get('/list/:urlInfo', crawleTestPage.list);
app.get('/categorylist/:urlInfo', crawleTestPage.categorylist);
app.get('/filelist/:urlInfo', crawleTestPage.filelist);
app.get('/download/:urlInfo', crawleTestPage.download);

/* eslint-disable no-console */
app.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}!`));
