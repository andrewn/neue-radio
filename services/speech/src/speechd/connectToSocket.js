const net = require("net");
const debug = require("debug");

const log = {
  send: debug("speechd:socket:send"),
  receive: debug("speechd:socket:receive")
};

const { getSocketPath } = require("./environment");

module.exports = ({ socketPath = getSocketPath() } = {}) => {
  const socket = net.createConnection(socketPath);

  // TODO: Handle events and responses from the connection
  socket.on("data", data => log.receive(data.toString()));

  const api = {
    send: (...params) => {
      log.send(...params);
      socket.write(...params);
    }
  };

  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      resolve(api);
    });

    socket.on("error", err => {
      reject(err);
    });
  });
};
