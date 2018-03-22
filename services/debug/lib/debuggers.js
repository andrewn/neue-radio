const ip = require('ip');
const http = require('http');
const assert = require('assert');

const getDeviceListUrl = (defaultIp, defaultPort) => (currentIp) => (
  `http://${defaultIp || currentIp}:${defaultPort}/json/list`
);

const get = ({ debuggerHost = false, debuggerPort }) => {
  assert(debuggerPort, 'debuggerPort required');

  const deviceListUrl = getDeviceListUrl(debuggerHost, debuggerPort);

  return () =>
    new Promise((resolve, reject) => {
      // Fetch a list of pages on the remote chrome instance
      http
        .get(deviceListUrl(ip.address()), res => {
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
