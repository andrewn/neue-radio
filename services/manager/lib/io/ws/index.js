const { Server: webSocket } = require('ws');
const ip = require('ip');
const http = require('http');

const createWebsocket = port => {
  const httpServer = http.createServer();
  const webSocketServer = new webSocket({ server: httpServer });

  //see https://github.com/websockets/ws
  webSocketServer.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received:', message);
      webSocketServer.clients.forEach(function each(client) {
        console.log('sending to ', client);
        client.send(message);
      });
    });
  });

  httpServer.listen(port, () => (
    console.log(`WebSockets Server http://${ip.address()}:${port}`)
  ));
};

module.exports = createWebsocket;
