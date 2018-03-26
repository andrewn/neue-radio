import validTopic from './validTopic.js';

export default log => {
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
