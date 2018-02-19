const WebSocket = (typeof window == 'undefined') ? require('ws') : window.WebSocket;
const hostname = (typeof window == 'undefined') ? '127.0.0.1' : window.location.hostname;

const defaultURL = `ws://${hostname}:8000`;
const topicRegexp = /^([a-z]+)\/(command|event)\/([a-z]+)$/;

const validTopic = (topic) => {
  if (topicRegexp.test(topic)) {
    return true;
  }

  throw new Error(`${topic} is not a valid topic`);
};

const createSubscriptions = (log) => {
  const isGroup = obj => (obj instanceof RegExp);
  const subscriptions = { single: new Map(), group: new Map() };

  const set = (map, topic, callback) => {
    const keys = Array.from(map.keys())
      .map(k => k.toString());

    if (keys.includes(topic.toString())) {
      throw new Error(`Already subscribed to ${topic}`);
    }

    map.set(topic, callback);
  };

  const matching = (topic) => {
    const groupMatches = Array.from(subscriptions.group.entries())
      .filter(([t, _]) => { return t.test(topic) })
      .map(([_, callback]) => { return callback });

    const singleMatch = subscriptions.single.get(topic);

    if (singleMatch) {
      groupMatches.push(singleMatch);
    }

    log(`Found ${groupMatches.length} subscriptions for ${topic}`);

    return groupMatches;
  };

  const unsubscribe = (topic) => {
    log(`Unsubscribing ${topic}`);

    if (isGroup(topic)) {
      subscriptions.group.delete(topic);
    } else {
      subscriptions.single.delete(topic);
    }
  };

  const subscribe = (topic, callback) => {
    log(`Subscribing ${topic}`);

    if (isGroup(topic)) {
      return set(subscriptions.group, topic, callback);
    }

    if (validTopic(topic)) {
      set(subscriptions.single, topic, callback);
    }
  };

  return { matching, subscribe, unsubscribe };
};

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


(function(exports) {
  exports.default = createWebsocket;
})(typeof exports === 'undefined' ? this.share = {} : exports);
