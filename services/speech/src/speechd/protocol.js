const LINE_ENDING = "\r\n";

class Protocol {
  constructor(connection) {
    this._connection = connection;
  }

  send(command) {
    const encoded = `${command}${LINE_ENDING}`;
    this._connection.send(encoded);
  }

  speak(utterance) {
    this.send("SPEAK");
    this.send(utterance);
    this.send(".");
  }
}

module.exports = Protocol;
