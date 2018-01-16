const assert = require('assert');
const http = require('http');
const URL = require('url');

const html = require('./template').html;

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
  <div class="item">
    <h3>${item.title}</h3>
    <label>Chrome's built-in debugger</label>
    <input type="text" value="${translateToChromeInternal(
      item.devtoolsFrontendUrl
    )}" />

    <div class="copy">
      <span class="do">Click anywhere to copy</span>
      <span class="done">Copied!</span>
    </div>
  </div>
`;

const start = ({ debuggers, port = 3000 } = {}) => {
  assert(typeof debuggers === 'function', 'list debugger function required');

  const tmpl = template();

  const requestHandler = async (request, response) => {
    try {
      const list = await debuggers();
      response.setHeader('Content-Type', 'text/html');

      const content = html(`
      <h1>Web Inspector</h1>
      <p>There ${list.length === 1 ? 'is' : 'are'} ${list.length} debugger${
        list.length === 1 ? '' : 's'
      } available.</p>
        ${list.map(tmpl).join('<hr />\n')}
      `);

      response.end(content);
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
