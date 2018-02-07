const WebSocket = require('ws');

const webSocket = (host, router) => {
  const wsPath = `ws://${host.hostname}:8000`;
  const ws = new WebSocket(wsPath);
  const handlePublish = sendMessage(ws);

  ws.on('open', () => console.info(`Listening to web socket ${wsPath}`));

  ws.addEventListener('message', function(evt) {
    const message = JSON.parse(evt.data);
    if (message.topic) {
      router.route(message.topic, message.payload);
    }
  });

  router.on('publish', handlePublish);
};

const sendMessage = ws => ({ topic, payload }) => (
  ws.send(
    JSON.stringify({ topic, payload })
  )
);

module.exports.create = webSocket;
