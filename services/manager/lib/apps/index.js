const fs = require('fs');
const path = require('path');

const isDirectory = ({ path }) => fs.lstatSync(path).isDirectory();
const isNotHiddenDirectory = ({ path }) => path[0] !== '.';

const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => ({ path: path.join(source, name), name }))
    .filter(isDirectory)
    .filter(isNotHiddenDirectory);

const appNamesToMount = appPath => getDirectories(appPath);

module.exports = appNamesToMount;
