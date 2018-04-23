const createWebsocket = require('websocket');

const webSocket = () => {
  const ws = createWebsocket();

  ws.ready.then(() => console.info('Listening to web socket'));

  return ws;
};

module.exports.create = webSocket;
