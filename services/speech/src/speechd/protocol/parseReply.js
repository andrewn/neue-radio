/**
 * Parse SSIP response messages
 * See: https://devel.freebsoft.org/doc/speechd/ssip.html#General-Rules
 */
module.exports = lineEnding =>
  function(message) {
    const matcher = /^(\d\d\d)([- ])(.*)$/;
    const parts = message.split(lineEnding);

    const response = parts.reduce(
      (prev, current) => {
        const matches = matcher.exec(current);

        if (matches) {
          const [_, statusCode, replyOrResult, content] = matches;
          const isResult = replyOrResult === ' ';

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
  };
