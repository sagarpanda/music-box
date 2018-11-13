/* eslint-disable no-template-curly-in-string */
const mongoProd = `mongodb://${process.env.MONGO_CONN}`;
const mongoDev = 'mongodb://localhost/test';

module.exports = {
  PORT: process.env.PORT ? process.env.PORT : 3001,
  DB_CON: process.env.MONGO_CONN ? mongoProd : mongoDev,

  PUBLIC_DIR: 'public',

  SESSION_SECRET: process.env.SESSION_SECRET,

  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL: 'https://mubox1.herokuapp.com/auth/facebook/callback',

  API_HEAD: {
    // Website you wish to allow to connect
    'Access-Control-Allow-Origin': 'https://sagarpanda.github.io',
    // Request methods you wish to allow
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    // Request headers you wish to allow
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type,Pragma,Authorization,Cache-Control',
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    'Access-Control-Allow-Credentials': true
  }
};
