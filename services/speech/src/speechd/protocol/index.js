const parseReply = require('./parseReply');

const LINE_ENDING = '\r\n';

class Protocol {
  constructor(connection) {
    this._connection = connection;
    this._parser = parseReply(LINE_ENDING);
  }

  send(command) {
    const encoded = `${command}${LINE_ENDING}`;
    return new Promise(resolve => {
      const handleResponse = message => {
        const response = this._parser(message);
        resolve(response);
      };
      this._connection.once('message', handleResponse);

      // Send command and resolve returned promise with
      // the response
      this._connection.send(encoded);
    });
  }

  async listVoices() {
    const response = await this.send('LIST VOICES');
    return response.lines.map(({ content }) => content);
  }

  async setVoiceType(voice) {
    const response = await this.send(`SET SELF VOICE_TYPE ${voice}`);
    return response.result.content;
  }

  async getVoiceType() {
    const response = await this.send('GET VOICE_TYPE');
    return response.lines[0].content;
  }

  async speak(utterance) {
    await this.send('SPEAK');
    this.send(utterance);
    this.send('.');
  }
}

module.exports = Protocol;
