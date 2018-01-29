const { readDir } = require('../fs');
const { join } = require('path');

const nonRemovable = ['manager', 'setup', 'debug'];

const servicesList = async (rootPath) => {
  const services = await readDir(join(rootPath, '..'));

  return services.filter(s => !nonRemovable.includes(s));
};

module.exports = servicesList;
