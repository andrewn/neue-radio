import validTopic from '../valid-topic';

const createSubscriptions = (log) => {
  const isGroup = obj => (obj instanceof RegExp);
  const subscriptions = { single: new Map(), group: new Map() };

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
      return subscriptions.group.set(topic, callback);
    }

    if (validTopic(topic)) {
      subscriptions.single.set(topic, callback);
    }
  };

  return { matching, subscribe, unsubscribe };
};

export default createSubscriptions;
