/*
  Emits on WebSocket when an RFID is presented/removed
*/
const createWebsocket = require('websocket');

const webSocket = () => {
  const ws = createWebsocket();

  ws.ready.then(() => console.log('Listening to web socket'));

  const send = (topic, payload) => ws.publish({ topic, payload });

  return {
    send
  };
};

module.exports = webSocket;
