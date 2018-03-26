const fs = require('fs');
const { readDir } = require('../fs');
const pathLib = require('path');

const isDirectory = (rootPath) => (path) => (
  fs.statSync(pathLib.join(rootPath, path)).isDirectory()
);

const isNotHidden = (path) => path[0] !== ".";

const pathsList = ({ rootPath, ignore = [] }) => async () => {
  const paths = await readDir(rootPath);

  return paths
    .filter(isNotHidden)
    .filter(isDirectory(rootPath))
    .filter(s => !ignore.includes(s));
};

module.exports = pathsList;
