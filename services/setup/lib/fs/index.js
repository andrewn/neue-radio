const fs = require('fs');
const { promisify } = require('util');

const open = promisify(fs.open);
const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

module.exports = {
  open,
  readDir,
  readFile,
  unlink,
  writeFile
};
