import validTopic from './valid-topic';
import createSubscriptions from './subscriptions';

const defaultURL = `ws://${location.hostname}:8000`;

const logger = debug => (...args) => {
  if (debug) {
    console.log(...args);
  }
};

const createWebsocket = (opts = {}) => {
  const { url = defaultURL, debug = false } = opts;

  const ws = new WebSocket(url);
  const log = logger(debug);

  const subscriptions = createSubscriptions(log);

  const onOpen = (event) => log('connected', event);

  const onMessage = (event) => {
    const { topic, payload } = JSON.parse(event.data);

    subscriptions.matching(topic).forEach(cb => cb({ topic, payload }));
  };

  const subscribe = (topic, cb) => {
    subscriptions.subscribe(topic, cb);
  };

  const unsubscribe = (topic) => {
    subscriptions.unsubscribe(topic);
  };

  const publish = ({ topic, payload = {} }) => {
    if (validTopic(topic)) {
      log(`Publishing to ${topic}`, payload);
      ws.send(JSON.stringify({ topic, payload }));
    }
  };

  const ready = new Promise(resolve => {
    ws.addEventListener('open', resolve);
  });

  ws.addEventListener('message', onMessage);

  return { publish, subscribe, ready };
};

export default createWebsocket;
