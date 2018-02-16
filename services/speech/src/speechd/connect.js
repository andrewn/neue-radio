const net = require("net");

const connectToSocket = require("./connectToSocket");
const spawnServer = require("./spawnServer");
const { ConnectionError } = require("./errors");

const connectToSocketOrNull = async params => {
  try {
    return await connectToSocket(params);
  } catch (e) {
    const isConnectionError = ["ENOENT", "ECONNREFUSED"].includes(e.code);
    if (isConnectionError) {
      return null;
    } else {
      throw e;
    }
  }
};

const connect = async ({ autoSpawn = true, ...params } = {}) => {
  let connection = await connectToSocketOrNull(params);

  if (connection == null && autoSpawn) {
    await spawnServer();
    connection = await connectToSocketOrNull(params);
  }

  if (connection == null) {
    throw new ConnectionError();
  }

  return connection;
};

module.exports = connect;
