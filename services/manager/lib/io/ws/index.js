const { Server: webSocket } = require('ws');
const ip = require('ip');
const http = require('http');

const logger = require('../logger');

const createWebsocket = port => {
  const httpServer = http.createServer();
  const webSocketServer = new webSocket({ server: httpServer });

  //see https://github.com/websockets/ws
  webSocketServer.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      logger.log('ws', `Received: ${message}`);
      logger.log(
        'ws',
        `Sending to ${logger.bold(webSocketServer.clients.length)} clients`
      );

      webSocketServer.clients.forEach(function each(client) {
        client.send(message);
      });
    });
  });

  httpServer.listen(port, () =>
    logger.log('ws', `WebSockets Server http://${ip.address()}:${port}`)
  );
};

module.exports = createWebsocket;
