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

const singleApp = appPath => (
  [{ path: appPath, name: path.posix.basename(appPath) }]
    .filter(isDirectory)
    .filter(isNotHiddenDirectory)
);

module.exports.findApps = findApps;
module.exports.singleApp = singleApp;
