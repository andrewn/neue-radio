const { basename, join } = require('path');
const { readFile, writeFile } = require('../fs');

const apps = ({ path, available }) => {
  const current = async () => {
    try {
      const buffer = await readFile(path);
      return basename(buffer.toString('ascii'));
    } catch(err) {
      console.warn(err);
      return '';
    }
  };

  const status = async () => {
    const active = await current();

    return available.map(a => ({
      name: a,
      active: a == active,
    }))
  };

  const set = async app => {
    const appPath = join(path, app);
    await writeFile(path, `APP_PATH=${appPath}`);
  };

  return { status, set };
};

module.exports = apps;
