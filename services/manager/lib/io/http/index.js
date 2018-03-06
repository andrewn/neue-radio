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

const mountApp = ({ server, name, path, index }) => {
  const httpPath = `/${name}`;

  const serveStatic = express.static(pathLib.join(path, 'src'), { index });
  server.use(httpPath, serveStatic);

  const serveModules = express.static(pathLib.join(path, 'node_modules'));
  server.use(pathLib.join(httpPath, 'modules'), serveModules);

  const serveAssets = express.static(pathLib.join(path, 'assets'));
  const listAssets = serveIndex(pathLib.join(path, 'assets'), { template: directoryListing });
  server.use(pathLib.join(httpPath, 'assets'), serveAssets, listAssets);
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

  const mountAt = '/websocket';
  const index = 'index.js';

  const serveStatic = express.static(
    path,
    { index }
  );

  server.use(mountAt, serveStatic);
};

const mountExternal = (apps, port) => {
  const server = express();

  apps.map(({ name, path }) => {
    mountApp({ server, name, path, index: 'external.html' })
  });

  mountWebsocket(server);

  startServer(server, port, 'Public');
};

const mountInternal = (apps, port, publicPath) => {
  const server = express();

  mountAppList(apps, server);

  apps.map(({ name, path }) => (
    mountApp({ server, name, path, index: 'internal.html' })
  ));

  mountWebsocket(server);

  server.use(
    express.static(publicPath)
  );

  startServer(server, port, 'Private');
};

module.exports = { mountExternal, mountInternal };
