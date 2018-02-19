const { URL } = require('url');
const createWebsocket = require('websocket').default;

const logger = require('../../logger')('ws');

const subscribedTopic = 'downloader/command/request';
const publishTopic = 'downloader/event/available';

const webSocket = ({ host, downloader }) => {
  const ws = createWebsocket();
  const callback = sendMessage(ws);
  const handler = handleMessage({ host, downloader, callback });

  ws.subscribe(subscribedTopic, handler);
};

const sendMessage = ws => (topic, payload) => (
  ws.publish({ topic, payload })
);

const handleMessage = ({ host, downloader, callback }) => async ({ payload }) => {
  const { url: sourceUrl } = payload;

  const videoPath = await downloader(sourceUrl);
  const url = new URL(videoPath, host);

  callback(
    publishTopic, { url, sourceUrl }
  );
};

module.exports = webSocket;
