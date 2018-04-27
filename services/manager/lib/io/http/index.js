const express = require('express');
const ip = require('ip');
const pathLib = require('path');
const serveIndex = require('serve-index');

const logger = require('../logger');

const mountAppList = require('./list');
const mountHomepage = require('./homepage');
const mountConfig = require('./config');

const directoryListing = ({ fileList, directory }, callback) => {
  const listing = fileList
    .filter(({ name }) => name[0] != '.')
    .map(({ name }) => directory + name);

  callback(false, JSON.stringify(listing));
};

const mountApp = ({ server, name, path, index }) => {
  const httpPath = `/${name}`;

  const serveStatic = express.static(pathLib.join(path, 'src'), { index });
  server.use(httpPath, serveStatic);

  const serveModules = express.static(pathLib.join(path, 'node_modules'));
  server.use(pathLib.join(httpPath, 'modules'), serveModules);

  const serveAssets = express.static(pathLib.join(path, 'assets'));
  const listAssets = serveIndex(pathLib.join(path, 'assets'), {
    template: directoryListing
  });
  server.use(pathLib.join(httpPath, 'assets'), serveAssets, listAssets);
};

const startServer = (server, port, name) => {
  server.listen(port, () =>
    logger.log('http', `${name} Server http://${ip.address()}:${port}`)
  );
};

const mountWebsocket = server => {
  const path = pathLib.dirname(require.resolve('websocket'));

  const mountAt = '/websocket';
  const index = 'index.js';

  const serveStatic = express.static(path, { index });

  server.use(mountAt, serveStatic);
};

const mountExternal = (apps, port) => {
  const server = express();

  apps.map(({ name, path }) => {
    mountApp({ server, name, path, index: 'external.html' });
  });

  mountAppList(apps, server);
  mountConfig(server);
  mountHomepage(apps, server);
  mountWebsocket(server);

  startServer(server, port, 'Public');
};

const mountInternal = (apps, port, publicPath) => {
  const server = express();

  logger.log('http', 'Mounted apps', apps.map(a => a.name));

  apps.map(({ name, path }) =>
    mountApp({ server, name, path, index: 'internal.html' })
  );

  mountAppList(apps, server);
  mountConfig(server);
  mountWebsocket(server);

  server.use(express.static(publicPath));

  startServer(server, port, 'Private');
};

module.exports = { mountExternal, mountInternal };
