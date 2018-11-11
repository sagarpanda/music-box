/* eslint-disable no-template-curly-in-string */
module.exports = {
  PORT: process.env.PORT ? process.env.PORT : 3001,
  DB_CON: 'mongodb://localhost/test',
  // DB_CON: 'mongodb://${DB_USER}:${DB_PWD}@ds054308.mlab.com:54308/${DB_NAME}',
  PUBLIC_DIR: 'public',
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
