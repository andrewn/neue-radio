const http = require('http');
const assert = require('assert');

const get = ({ debuggerHost, debuggerPort }) => {
  assert(debuggerHost, 'debuggerHost required');
  assert(debuggerPort, 'debuggerPort required');

  const deviceListUrl = `http://${debuggerHost}:${debuggerPort}/json/list`;

  return () =>
    new Promise((resolve, reject) => {
      // Fetch a list of pages on the remote chrome instance
      http
        .get(deviceListUrl, res => {
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', chunk => {
            rawData += chunk;
          });
          res.on('end', () => {
            try {
              const parsedData = JSON.parse(rawData);
              resolve(parsedData);
            } catch (e) {
              reject(e.message);
            }
          });
        })
        .on('error', e => {
          reject(`Got error: ${e.message}`);
        });
    });
};

module.exports = get;
