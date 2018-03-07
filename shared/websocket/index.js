const WebSocket =
  typeof window == "undefined" ? require("ws") : window.WebSocket;
const hostname =
  typeof window == "undefined" ? "127.0.0.1" : window.location.hostname;

const defaultURL = `ws://${hostname}:8000`;
const topicRegexp = /^([a-z]+[a-z0-9-]*)\/(command|event)\/([a-z]+[a-z0-9-]*)$/;

class InvalidTopicError extends Error {
  constructor(topic) {
    super(
      `"${topic}" is not a valid topic. For valid topic names, see the WebSocket guide: https://github.com/andrewn/neue-radio/blob/master/docs/WEBSOCKETS.md.
`
    );
  }
}

const validTopic = topic => {
  if (topicRegexp.test(topic)) {
    return true;
  }

  throw new InvalidTopicError(topic);
};

const createSubscriptions = log => {
  const isGroup = obj => obj instanceof RegExp;
  const subscriptions = { single: new Map(), group: new Map() };

  const set = (map, topic, callback) => {
    const keys = Array.from(map.keys()).map(k => k.toString());

    if (keys.includes(topic.toString())) {
      throw new Error(`Already subscribed to ${topic}`);
    }

    map.set(topic, callback);
  };

  const matching = topic => {
    const groupMatches = Array.from(subscriptions.group.entries())
      .filter(([t, _]) => {
        return t.test(topic);
      })
      .map(([_, callback]) => {
        return callback;
      });

    const singleMatch = subscriptions.single.get(topic);

    if (singleMatch) {
      groupMatches.push(singleMatch);
    }

    log(`Found ${groupMatches.length} subscriptions for ${topic}`);

    return groupMatches;
  };

  const unsubscribe = topic => {
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

  let ws;

  const log = logger(debug);

  const subscriptions = createSubscriptions(log);

  const onMessage = event => {
    const { topic, payload } = JSON.parse(event.data);

    subscriptions.matching(topic).forEach(cb => cb({ topic, payload }));
  };

  const onClose = err => {
    log("Websocket disconnected", err);
    setTimeout(connect, 500);
  };

  const onError = err => {
    log("Websocket error", err);
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
    ws.addEventListener("message", onMessage);
    ws.addEventListener("close", onClose);
    ws.addEventListener("error", onError);

    ready = new Promise(resolve => {
      ws.addEventListener("open", resolve);
    }).then(() => log(`Connected to ${url}`));
  };

  connect();

  return { publish, subscribe, unsubscribe, ready };
};

(function(exports) {
  exports.default = createWebsocket;
})(typeof exports === "undefined" ? (this.share = {}) : exports);
