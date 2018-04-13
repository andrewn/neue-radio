// const SerialPort = require('serialport');
const createWebSocket = require('websocket');
const debug = require('debug')('serial:main');

const router = require('./router');

const main = () => {
  debug('Init');

  const websocket = createWebSocket();
  router({ websocket });
};

main();
