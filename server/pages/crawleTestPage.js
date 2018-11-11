import path from 'path';
import Promise from 'bluebird';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

function djworldsCheck(urlStr, splitedUrl, argAllowTypes) {
  const allowTypes = argAllowTypes || ['filelist', 'download', 'files', 'categorylist'];
  let ob = null;
  if (splitedUrl[2] === 'djworlds.in' &&
  allowTypes.indexOf(splitedUrl[3]) > -1 &&
  urlStr.indexOf('video') === -1) {
    ob = { type: splitedUrl[3] };
  }
  return ob;
}

function pagalworldCheck(urlStr, splitedUrl, argAllowTypes) {
  const allowTypes = argAllowTypes || ['list', 'download', 'files'];
  const filename = path.basename(urlStr, '.html');
  const ext = path.extname(urlStr);
  let ob = null;
  if ((splitedUrl[2] === 'www.pagalworld.org' || splitedUrl[2] === 'pagalworld3.net')
   && (allowTypes.indexOf(filename) > -1 || ext === '.mp3')
  ) {
    ob = { type: 'list' };
    if (ext === '.mp3') {
      ob = { type: 'files' };
    }
  }
  return ob;
}

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

function initMusicList(argUrl, allowTypes) {
  // const urlPath = argUrl || 'http://djworlds.in';
  // const urlPath = argUrl || 'https://www.pagalworld.org';
  const urlPath = argUrl || 'https://mymp3singer.fun';
  return new Promise((resolve) => {
    // res.send('Hello World!');
    // download, filelist, featured, categorylist, files
    // http://djworlds.in
    // http://djworlds.in/filelist/9537/hatt-ja-tau-veerey-ki-wedding-video-song/new2old/1.html
    // http://djworlds.in/featured/1
    // http://djworlds.in/download/66638/be-my-lover-roma-sagar.html
    JSDOM.fromURL(urlPath).then((dom) => {
      const jsonData = [];
      dom.window.document.querySelectorAll('a').forEach((aa) => {
        const dd = { label: aa.text, url: aa.href };
        dd.label = dd.label.replace(/\t/g, '');
        dd.label = dd.label.trim();
        const arrSplit = dd.url.split('/');
        const opt = mymp3SingerCheck(dd.url, arrSplit, allowTypes);
        // const ext = path.extname(dd.url);
        if (dd.label !== '' && opt) {
          jsonData.push({ ...dd, ...opt });
        }
      });
      resolve(jsonData);
    });
  });
}

function renderList(jsonData) {
  // res.json(jsonData);
  return new Promise((resolve) => {
    let str = '';
    for (let i = 0; i < jsonData.length; i += 1) {
      const encodeStr = Buffer.from(JSON.stringify(jsonData[i])).toString('base64');
      const audioOrLink = jsonData[i].type === 'files' ? `
      <audio controls preload="none">
        <source src="${jsonData[i].url}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>` : '';
      str += `
      <li>
        <span>${i + 1} - ${jsonData[i].label}</span> |
        <a href="/${jsonData[i].type}/${encodeStr}">${jsonData[i].url}</a> <br />
        ${audioOrLink}
      </li>`;
    }
    str = `
    <a href="/test">Home</a>
    <ul>${str}</ul>`;
    resolve(str);
  });
}

/* Screens */

function test(req, res) {
  initMusicList().then(renderList).then((htmlStr) => {
    res.send(htmlStr);
  });
}

function list(req, res) {
  const { urlInfo } = req.params;
  const urlInfoStr = Buffer.from(urlInfo, 'base64').toString();
  const urlInfoJson = JSON.parse(urlInfoStr);
  initMusicList(urlInfoJson.url).then(renderList).then((htmlStr) => {
    res.send(htmlStr);
  });
}

function categorylist(req, res) {
  const { urlInfo } = req.params;
  const urlInfoStr = Buffer.from(urlInfo, 'base64').toString();
  const urlInfoJson = JSON.parse(urlInfoStr);
  initMusicList(urlInfoJson.url, ['categorylist', 'filelist', 'download']).then(renderList).then((htmlStr) => {
    res.send(htmlStr);
  });
}

function filelist(req, res) {
  const { urlInfo } = req.params;
  const urlInfoStr = Buffer.from(urlInfo, 'base64').toString();
  const urlInfoJson = JSON.parse(urlInfoStr);
  initMusicList(urlInfoJson.url, ['download']).then(renderList).then((htmlStr) => {
    res.send(htmlStr);
  });
}

function download(req, res) {
  const { urlInfo } = req.params;
  const urlInfoStr = Buffer.from(urlInfo, 'base64').toString();
  const urlInfoJson = JSON.parse(urlInfoStr);
  initMusicList(urlInfoJson.url, ['files']).then(renderList).then((htmlStr) => {
    res.send(htmlStr);
  });
}

const crawleTestPage = {
  test,
  list,
  categorylist,
  filelist,
  download
};

export default crawleTestPage;
