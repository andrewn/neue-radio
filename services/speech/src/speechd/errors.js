class ConnectionError extends Error {
  constructor() {
    super('Cannot connect to speech-dispatcher server');
  }
}

class ExecutableNotFoundError extends Error {
  constructor() {
    super('speech-dispatcher not found on PATH');
    this.message =
      "The command 'which speech-dispatcher' did not return the executable";
  }
}

module.exports = {
  ConnectionError,
  ExecutableNotFoundError
};
