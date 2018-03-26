const net = require('net');
const debug = require('debug');
const { EventEmitter } = require('events');

const { ConnectionError } = require('./errors');

const log = {
  connect: debug('speechd:socket:connect'),
  send: debug('speechd:socket:send'),
  receive: debug('speechd:socket:receive')
};

const { getPort } = require('./environment');

module.exports = ({ host = null, port = getPort() } = {}) => {
  const api = new EventEmitter();
  const socket = net.createConnection({ host, port });

  log.connect(`Connect to ${host}:${port}`);

  socket.on('data', data => {
    log.receive(data.toString());
    api.emit('message', data.toString());
  });

  api.send = (...params) => {
    log.send(...params);
    socket.write(...params);
  };

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      resolve(api);
    });

    socket.on('error', e => {
      const isConnectionError = ['ENOENT', 'ECONNREFUSED'].includes(e.code);
      const error = isConnectionError ? new ConnectionError() : e;
      reject(error);
    });
  });
};
