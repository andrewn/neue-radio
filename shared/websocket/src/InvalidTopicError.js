export default class InvalidTopicError extends Error {
  constructor(topic) {
    super(
      `"${topic}" is not a valid topic. For valid topic names, see the WebSocket guide: https://github.com/andrewn/neue-radio/blob/master/docs/WEBSOCKETS.md.
`
    );
  }
}
