const fs = require('fs');
const path = require('path');

const isDirectory = ({ path }) => fs.statSync(path).isDirectory();
const isNotHiddenDirectory = ({ path }) => path[0] !== '.';

const findApps = source => (
  fs
    .readdirSync(source)
    .map(name => ({ path: path.join(source, name), name }))
    .filter(isDirectory)
    .filter(isNotHiddenDirectory)
);

const knownApps = (appPath = []) => (
  appPath
    .split(':')
    .map(a => ({ path: a, name: path.posix.basename(a) }))
    .filter(isDirectory)
    .filter(isNotHiddenDirectory)
);

module.exports.findApps = findApps;
module.exports.knownApps = knownApps;
