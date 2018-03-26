const { basename, join } = require('path');
const { readFile, writeFile } = require('../fs');

const pathEnv = 'APP_PATH=';

const apps = ({ path, rootPath, available, alwaysMount = [] }) => {
  const current = async () => {
    try {
      const buffer = await readFile(path);

      return buffer
        .toString('ascii')
        .replace(pathEnv, '')
        .split(':')
        .map(a => basename(a));
    } catch(err) {
      console.warn('File not found', err);
      return [];
    }
  };

  const status = async () => {
    const activeApps = await current();
    const availableApps = await available();

    return availableApps.map(a => ({
      name: a,
      active: activeApps.includes(a),
    }))
  };

  const set = async (apps=[]) => {
    if(apps.length == 0) {
      return await writeFile(path, '');
    }

    const appSet = [...alwaysMount, ...apps];

    const appPaths = appSet.map(app => join(rootPath, app));

    await writeFile(path, pathEnv + appPaths.join(':'));
  };

  return { status, set };
};

module.exports = apps;
