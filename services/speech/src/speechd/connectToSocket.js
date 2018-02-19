const net = require("net");
const debug = require("debug");
const { EventEmitter } = require("events");

const { ConnectionError } = require("./errors");

const log = {
  send: debug("speechd:socket:send"),
  receive: debug("speechd:socket:receive")
};

const { getSocketPath } = require("./environment");

module.exports = ({ socketPath = getSocketPath() } = {}) => {
  const api = new EventEmitter();
  const socket = net.createConnection(socketPath);

  socket.on("data", data => {
    log.receive(data.toString());
    api.emit("message", data.toString());
  });

  api.send = (...params) => {
    log.send(...params);
    socket.write(...params);
  };

  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      resolve(api);
    });

    socket.on("error", e => {
      const isConnectionError = ["ENOENT", "ECONNREFUSED"].includes(e.code);
      const error = isConnectionError ? new ConnectionError() : e;
      reject(error);
    });
  });
};
