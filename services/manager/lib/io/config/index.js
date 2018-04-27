const { resolve } = require('path');
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const configPath = resolve(process.env.CONFIG_PATH);

module.exports = async () => {
  try {
    return JSON.parse(await readFile(configPath));
  } catch (error) {
    console.error('Error reading config: ', error);
    return null;
  }
};
