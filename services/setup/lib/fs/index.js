const fs = require('fs');
const { promisify } = require('util');

const open = promisify(fs.open);
const readDir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

module.exports = { open, readDir, unlink };
