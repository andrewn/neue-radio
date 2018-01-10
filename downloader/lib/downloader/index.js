const path = require('path');
const { URL } = require('url');

const asyncExec = require('./async-exec');

const download = rootPath => async url => {
  const validatedURL = new URL(url);
  const output = await asyncExec(command(rootPath, validatedURL));

  return parsedOutputPath(rootPath, output);
};

const command = (rootPath, url) => {
  const videoPath = path.join(rootPath, '%(id)s.%(ext)s');

  return `youtube-dl -v -o "${videoPath}" -f bestaudio ${url.toString()}`;
};

const parsedOutputPath = (rootPath, output) => {
  const videoPath = path.join(rootPath, '([0-9a-z_\-\\\/\.]+)');
  const match = output.match(
    new RegExp(`\[download\].*${videoPath}.*`, 'i')
  );

  return match[1];
};

module.exports.download = download;
