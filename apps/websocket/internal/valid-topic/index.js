const topicRegexp = /^([a-z]+)\/(command|event)\/([a-z]+)$/;

const validTopic = (topic) => {
  if (topicRegexp.test(topic)) {
    return true;
  }

  throw new Error(`${topic} is not a valid topic`);
};

export default validTopic;
