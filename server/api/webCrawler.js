import Promise from 'bluebird';
import { JSDOM } from 'jsdom';
import mongoose from 'mongoose';
import ldFindIndex from 'lodash/findIndex';

const { Schema } = mongoose;

const baseUrl = 'https://mymp3singer.fun';

// create a schema
const schema = new Schema({
  url: String,
  response: Object,
  created_at: Date
}, { strict: false });

const Model = mongoose.model('crawlers', schema);

/*
function mymp3SingerCheck(urlStr, splitedUrl, argAllowTypes) {
  const allowTypes = argAllowTypes || ['filelist', 'download', 'files', 'categorylist'];
  let ob = null;
  if (splitedUrl[2] === 'mymp3singer.fun' &&
  allowTypes.indexOf(splitedUrl[3]) > -1 &&
  urlStr.indexOf('video') === -1) {
    ob = { type: splitedUrl[3] };
  }
  return ob;
}
*/

function extract(elm) {
  const dd = { label: elm.text, url: elm.href };
  dd.label = dd.label.replace(/\t/g, '');
  dd.label = dd.label.trim();
  return dd;
}

function extractFileList(elm) {
  const label = elm.text;
  const url = elm.href;
  const id = url.split('/')[4];
  const img = elm.querySelector('img') ? elm.querySelector('img').getAttribute('src') : '';
  return {
    label, id, url, img
  };
}

function extractDownload(elm) {
  let label = elm.text;
  const url = elm.href.replace('%2C', '');
  const id = url.split('/')[4];
  const nodes = elm.firstChild ? elm.firstChild.childNodes : [];
  const ob = {};
  if (nodes[0] && nodes[0].textContent) {
    label = nodes[0].textContent;
  }
  if (nodes[4] && nodes[4].textContent) {
    ob.artist = nodes[4].textContent;
  }
  if (nodes[6] && nodes[6].textContent) {
    ob.size = nodes[6].textContent;
  }
  if (nodes[8] && nodes[8].textContent) {
    ob.hits = nodes[8].textContent;
  }
  return {
    label, url, id, ...ob
  };
}

function crawler(argUrl, { querySelector, forScreen }) {
  const urlPath = argUrl || `${baseUrl}/categorylist/2899/latest_bollywood_mp3_song/default/1`;
  return new Promise((resolve) => {
    JSDOM.fromURL(urlPath).then((dom) => {
      const jsonData = [];
      querySelector(dom).forEach((aa) => {
        let ob = null;
        if (forScreen === 'filelist') {
          ob = extractFileList(aa);
        } else if (forScreen === 'download') {
          ob = extractDownload(aa);
        } else {
          ob = extract(aa);
        }
        if (ob) {
          jsonData.push(ob);
        }
      });
      resolve(jsonData);
    });
  });
}

function crawlerResponse(data, option) {
  return new Promise((resolve) => {
    const querySelector = dom => dom.window.document.querySelector('.fhd').nextElementSibling.querySelectorAll('a');
    const crawlers = data.map(item => crawler(item.url, { querySelector }));

    Promise.all(crawlers).then((rs) => {
      const ob = rs.map((item, idx) => {
        const rtn = {
          ...data[idx],
          movieId: option.id,
          movie: option.label,
          movieUrl: option.url,
          url: item[0].url
        };
        return rtn;
      });
      resolve(ob);
    });
  });
}

function checkCategoryList(list) {
  const filteredList = list.filter((item) => {
    const type = item.url.split('/')[3];
    return type === 'categorylist';
  });
  return new Promise((resolve) => {
    const querySelector = dom => dom.window.document.querySelector('.catList').querySelectorAll('a');
    const crawlers = filteredList.map(item => crawler(item.url, { querySelector }));
    Promise.all(crawlers).then((rs) => {
      const ob = list.map((item) => {
        let rtn = item;
        const idx = ldFindIndex(filteredList, { url: item.url });
        if (idx > -1) {
          rtn = { ...item, url: rs[idx][0].url };
        }
        return rtn;
      });
      resolve(ob);
    });
  });
}

function saveCrawledData(url, data) {
  return new Promise((resolve, reject) => {
    Model.create({ url, response: data, created_at: new Date() }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

/* ******** APIs ********* */

function movies(req, res) {
  const { page = 1 } = req.params;
  const url = `${baseUrl}/categorylist/2899/latest_bollywood_mp3_song/default/${page}`;
  const querySelector = dom => dom.window.document.querySelector('.catList').querySelectorAll('a');
  // Check if already crawled data preset in db
  Model.find({ url }, { _id: 0, __v: 0 }, (err, records) => {
    if (records.length === 0) { // movies api - crawling
      crawler(url, { querySelector, forScreen: 'filelist' })
        .then(data => checkCategoryList(data))
        .then(data => saveCrawledData(url, data))
        .then((data) => {
          res.json(data);
        });
    } else { // movies api - no crawling
      res.json(records[0].response);
    }
  });
}

function movieSongs(req, res) {
  const { info } = req.params;
  const infoStr = Buffer.from(info, 'base64').toString();
  const infoJson = JSON.parse(infoStr);
  // const url = 'https://mymp3singer.fun/filelist/9348/dassehra_%282018%29/new2old/1';
  const querySelector = dom => dom.window.document.querySelectorAll('a.fileName');
  // Check if already crawled data preset in db
  Model.find({ url: infoJson.url }, { _id: 0, __v: 0 }, (err, records) => {
    if (records.length === 0) { // movieSongs api - crawling
      crawler(infoJson.url, { querySelector, forScreen: 'download' })
        .then(data => crawlerResponse(data, infoJson))
        .then(data => saveCrawledData(infoJson.url, data))
        .then((data) => {
          res.json(data);
        });
    } else { // movieSongs api - no crawling
      res.json(records[0].response);
    }
  });
}

function songDownloadLinks(req, res) {
  const { info } = req.params;
  const infoStr = Buffer.from(info, 'base64').toString();
  const infoJson = JSON.parse(infoStr);
  // const url = 'https://mymp3singer.fun/download/71232/joganiya';
  const querySelector = dom => dom.window.document.querySelector('.fhd').nextElementSibling.querySelectorAll('a');
  crawler(infoJson.url, { querySelector }).then((data) => {
    res.json(data);
  });
}

const webCrawler = {
  movies,
  movieSongs,
  songDownloadLinks
};

export default webCrawler;
