const express = require('express');
const ip = require('ip');
const pathLib = require('path');
const serveIndex = require('serve-index')

const logger = require('../logger');

const directoryListing = ({ fileList, directory }, callback) => {
  const listing = fileList
    .filter(({ name }) => (name[0] != '.'))
    .map(({ name }) => (directory + name));

  callback(false, JSON.stringify(listing));
};

const mountApp = ({ server, name, path }) => {
  const mountAt = `/${name}`;

  const serveStatic = express.static(
    path,
    { index: ['index.html', 'index.htm', 'index.js'] }
  );

  const serveDirectory = serveIndex(path, { template: directoryListing });

  server.use(mountAt, serveStatic, serveDirectory);
};

const mountAppList = (apps, server) => {
  const appNames = apps.map( a => a.name );

  server.get('/apps', (req, res) =>
    res.json({
      apps: appNames,
    })
  );

  logger.log('http', 'Mounted apps', appNames);
};

const startServer = (server, port, name) => {
  server.listen(port, () => (
    logger.log('http', `${name} Server http://${ip.address()}:${port}`)
  ));
};

const mountWebsocket = server => {
  const path = pathLib.dirname(require.resolve('websocket'));

  mountApp({ server, name: 'websocket', path });
};

const mountExternal = (apps, port) => {
  const server = express();

  apps.map(({ name, path }) => {
    mountApp({ server, name, path: pathLib.join(path, 'external') })
  });

  mountWebsocket(server);

  startServer(server, port, 'Public');
};

const mountInternal = (apps, port, publicPath) => {
  const server = express();

  mountAppList(apps, server);

  apps.map(({ name, path }) => (
    mountApp({ server, name, path: pathLib.join(path, 'internal') })
  ));

  mountWebsocket(server);

  server.use(
    express.static(publicPath)
  );

  startServer(server, port, 'Private');
};

module.exports = { mountExternal, mountInternal };
