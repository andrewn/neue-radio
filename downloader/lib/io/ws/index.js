const { URL } = require('url');
const WebSocket = require('ws');

const subscribedTopic = 'mediaRequest';
const publishTopic = 'mediaAvailable';

const webSocket = ({ host, downloader }) => {
  const wsPath = `ws://${host.hostname}:8000`;
  const ws = new WebSocket(wsPath);
  const callback = sendMessage(ws);
  const handler = handleMessage({ host, downloader, callback });

  ws.on('open', () => console.log(`Listening to web socket ${wsPath}`));

  ws.addEventListener('message', function(evt) {
    handler(
      JSON.parse(evt.data)
    );
  });
};

const sendMessage = ws => (topic, payload) => (
  ws.send(
    JSON.stringify({ topic, payload })
  )
);

const handleMessage = ({ host, downloader, callback }) => async ({ topic, payload }) => {
  const { url: sourceUrl } = payload;

  if (topic != subscribedTopic || typeof sourceUrl == 'undefined') {
    return;
  }

  const videoPath = await downloader(sourceUrl);
  const url = new URL(videoPath, host);

  callback(
    publishTopic, { url, sourceUrl }
  );
};

module.exports = webSocket;
