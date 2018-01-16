const assert = require('assert');
const http = require('http');
const URL = require('url');

const regex = new RegExp('\\?ws=([^&]+).*');

const websocketFromUrl = value => {
  const url = URL.parse(value);
  return url.search.match(regex)[1];
};

const translateToChromeInternal = value =>
  `chrome-devtools://devtools/bundled/inspector.html?ws=${websocketFromUrl(
    value
  )}`;

const template = () => item => `
  <div>
    <h3>${item.title}</h3>
    <a href="${translateToChromeInternal(
      item.devtoolsFrontendUrl
    )}">Chrome built-in debugger</a>
  </div>
`;

const start = ({ debuggers, port = 3000 } = {}) => {
  assert(typeof debuggers === 'function', 'list debugger function required');

  const tmpl = template();

  const requestHandler = async (request, response) => {
    try {
      const list = await debuggers();
      response.setHeader('Content-Type', 'text/html');
      response.end(`
      There are ${list.length} debuggers.
      ${list.map(tmpl).join('<hr />\n')}
    `);
    } catch (e) {
      console.error(e);
      response.end(`Error: ${e.message}`);
    }
  };

  const server = http.createServer(requestHandler);

  server.listen(port, err => {
    if (err) {
      return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
  });
};

module.exports = start;
