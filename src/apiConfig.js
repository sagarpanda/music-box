/* eslint-disable no-template-curly-in-string */
import ldTemplate from 'lodash/template';

const apis = {
  movies: '/api/xtpull/movies/${pageNum}',
  movieSongs: '/api/xtpull/movieSongs/${encode}'
};
const condUrl = 'sagarpanda.github.io';
const baseUrl = window.location.hostname === condUrl ? 'https://mubox1.herokuapp.com' : '';

function getApiUrl(name, options) {
  const params = options || {};
  return baseUrl + ldTemplate(apis[name])(params);
}

function getLoggedInUser() {
  // eslint-disable-next-line no-underscore-dangle
  const u = JSON.parse(atob(window.__u));
  return u.n || null;
}

const apiConfig = {
  getApiUrl,
  loggedInUser: getLoggedInUser()
};

export default apiConfig;
