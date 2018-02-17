const LINE_ENDING = "\r\n";

class Protocol {
  constructor(connection) {
    this._connection = connection;
  }

  _parse(message) {
    const matcher = /^(\d\d\d)([- ])(.*)$/;
    const parts = message.split(LINE_ENDING);

    const response = parts.reduce(
      (prev, current) => {
        const matches = matcher.exec(current);
        if (matches) {
          const [_, statusCode, replyOrResult, content] = matches;
          const isResult = replyOrResult === " ";

          const obj = {
            code: statusCode,
            content
          };

          if (isResult) {
            prev.result = obj;
          } else {
            prev.lines.push(obj);
          }
        }

        return prev;
      },
      {
        lines: [],
        result: {
          code: null,
          content: null
        }
      }
    );

    return response;
  }

  send(command) {
    const encoded = `${command}${LINE_ENDING}`;
    return new Promise(resolve => {
      const handleResponse = message => {
        const response = this._parse(message);
        resolve(response);
      };
      this._connection.once("message", handleResponse);

      // Send command and resolve returned promise with
      // the response
      this._connection.send(encoded);
    });
  }

  async listVoices() {
    const response = await this.send("LIST VOICES");
    return response.lines.map(({ content }) => content);
  }

  async speak(utterance) {
    await this.send("SPEAK");
    this.send(utterance);
    this.send(".");
  }
}

module.exports = Protocol;
