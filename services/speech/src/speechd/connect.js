const net = require('net');

const connectToSocket = require('./connectToSocket');
const spawnServer = require('./spawnServer');
const { ConnectionError } = require('./errors');

const connect = async ({ autoSpawn = true, ...params } = {}) => {
  let connection = null;

  try {
    connection = await connectToSocket(params);
  } catch (e) {
    if (e instanceof ConnectionError && autoSpawn) {
      connection = null;
    } else {
      throw e;
    }
  }

  if (connection == null && autoSpawn) {
    await spawnServer();
    connection = await connectToSocket(params);
  }

  return connection;
};

module.exports = connect;
