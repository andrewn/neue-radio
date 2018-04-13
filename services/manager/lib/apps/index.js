const fs = require('fs');
const path = require('path');

const isDirectory = ({ path }) => fs.statSync(path).isDirectory();
const isNotHiddenDirectory = ({ path }) => path[0] !== '.';

const findApps = rootPath => source => {
  const fullPath = path.resolve(rootPath, source);

  return fs
    .readdirSync(fullPath)
    .map(name => ({ path: path.join(fullPath, name), name }))
    .filter(isDirectory)
    .filter(isNotHiddenDirectory);
};

const knownApps = rootPath => appPath =>
  appPath
    .split(':')
    .map(a => ({
      path: path.resolve(rootPath, a),
      name: path.posix.basename(a)
    }))
    .filter(isDirectory)
    .filter(isNotHiddenDirectory);

module.exports.findApps = findApps;
module.exports.knownApps = knownApps;
