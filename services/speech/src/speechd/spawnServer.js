const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const debug = require('debug')('speechd:spawn');
const { getPort, getExecutablePath } = require('./environment');

module.exports = async () => {
  const path = await getExecutablePath();
  const command = `${path} --communication-method=inet_socket --port=${getPort()}`;

  debug('spawn exec: ', command);

  try {
    return await exec(command);
  } catch (e) {
    debug('Caught error spawning server: ', e);
    return null;
  }
};
