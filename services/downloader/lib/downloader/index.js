const path = require('path');
const { URL } = require('url');

const asyncExec = require('./async-exec');
const logger = require('../logger')('downloader');

const download = downloadPath => async url => {
  const validatedURL = new URL(url);

  logger.info(`Downloading ${validatedURL}`);

  const output = await asyncExec(command(downloadPath, validatedURL));

  return parsedOutputPath(downloadPath, output);
};

const command = (downloadPath, url) => {
  const videoPath = path.join(downloadPath, '%(id)s.%(ext)s');

  return `youtube-dl -v -o "${videoPath}" -f bestaudio ${url.toString()}`;
};

const parsedOutputPath = (downloadPath, output) => {
  const videoPath = path.join(downloadPath, '([0-9a-z_\\-\\\/\.]+)');
  const match = output.match(
    new RegExp(`\[download\].*${videoPath}.*`, 'i')
  );

  logger.info(`Downloaded to ${match[1]}`);
  return match[1];
};

module.exports = download;
