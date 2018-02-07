const { basename, join } = require('path');
const { readFile, writeFile } = require('../fs');

const pathEnv = 'APP_PATH=';

const apps = ({ path, rootPath, available }) => {
  const current = async () => {
    try {
      const buffer = await readFile(path);

      return buffer
        .toString('ascii')
        .replace(pathEnv, '')
        .split(':')
        .map(a => basename(a));
    } catch(err) {
      console.warn(err);
      return [];
    }
  };

  const status = async () => {
    const active = await current();

    return available.map(a => ({
      name: a,
      active: active.includes(a),
    }))
  };

  const set = async (apps=[]) => {
    if(apps.length == 0) {
      return await writeFile(path, '');
    }

    const appPaths = apps.map(app => join(rootPath, app));

    await writeFile(path, pathEnv + appPaths.join(':'));
  };

  return { status, set };
};

module.exports = apps;
