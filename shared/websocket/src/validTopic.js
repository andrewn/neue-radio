import InvalidTopicError from './InvalidTopicError.js';

const topicRegexp = /^([a-z]+[a-z0-9-]*)\/(command|event)\/([a-z]+[a-z0-9-]*)$/;

export default topic => {
  if (topicRegexp.test(topic)) {
    return true;
  }

  throw new InvalidTopicError(topic);
};
