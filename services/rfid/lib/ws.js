/*
  Emits on WebSocket when an RFID is presented/removed
*/
const WebSocket = require('ws');

const webSocket = ({ host }) => {
  const wsPath = `ws://${host.hostname}:8000`;
  const ws = new WebSocket(wsPath);

  ws.on('open', () => console.log(`Listening to web socket ${wsPath}`));

  const send = sendMessage(ws);

  return {
    send
  };
};

const sendMessage = ws => (topic, payload) =>
  ws.send(JSON.stringify({ topic, payload }));

module.exports = webSocket;
