class ConnectionError extends Error {
  constructor() {
    super("Cannot connect to speech-dispatcher server");
  }
}

module.exports = {
  ConnectionError
};
