import validTopic from './validTopic.js';
import createSubscriptions from './createSubscriptions.js';
import logger from './logger.js';

const WebSocket =
  typeof window == 'undefined' ? require('ws') : window.WebSocket;
const hostname =
  typeof window == 'undefined' ? '127.0.0.1' : window.location.hostname;

const defaultURL = `ws://${hostname}:8000`;

export default (opts = {}) => {
  const { url = defaultURL, debug = false } = opts;

  let ws;

  const log = logger(debug);

  const subscriptions = createSubscriptions(log);

  const onMessage = event => {
    const { topic, payload } = JSON.parse(event.data);

    subscriptions.matching(topic).forEach(cb => cb({ topic, payload }));
  };

  const onClose = err => {
    log('Websocket disconnected', err);
    setTimeout(connect, 500);
  };

  const onError = err => {
    log('Websocket error', err);
  };

  const subscribe = (topic, cb) => {
    subscriptions.subscribe(topic, cb);
  };

  const unsubscribe = topic => {
    subscriptions.unsubscribe(topic);
  };

  const publish = ({ topic, payload = {} }) => {
    if (validTopic(topic)) {
      ready.then(() => {
        log(`Publishing to ${topic}`, payload);
        ws.send(JSON.stringify({ topic, payload }));
      });
    }
  };

  let ready;

  const connect = () => {
    log(`Connecting to ${url}`);

    ws = new WebSocket(url);
    ws.addEventListener('message', onMessage);
    ws.addEventListener('close', onClose);
    ws.addEventListener('error', onError);

    ready = new Promise(resolve => {
      ws.addEventListener('open', resolve);
    }).then(() => log(`Connected to ${url}`));
  };

  connect();

  return { publish, subscribe, unsubscribe, ready };
};
