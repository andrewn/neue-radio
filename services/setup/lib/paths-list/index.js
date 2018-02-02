const { readDir } = require('../fs');

const pathsList = async ({ rootPath, ignore = [] }) => {
  const paths = await readDir(rootPath);

  return paths.filter(s => !ignore.includes(s));
};

module.exports = pathsList;
