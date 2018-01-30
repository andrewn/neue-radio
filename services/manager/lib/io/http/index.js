const express = require('express');
const ip = require('ip');
const pathLib = require('path');

const logger = require('../logger');

const mountApp = ({ server, name, path }) => {
  const mountAt = `/${name}`;

  server.use(mountAt, express.static(path));
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

const mountExternal = (apps, port, index) => {
  const server = express();

  apps.map(({ name, path }) => {
    mountApp({ server, name, path: pathLib.join(path, 'external') })
  });

  startServer(server, port, 'Public');
};

const mountInternal = (apps, port, publicPath) => {
  const server = express();

  mountAppList(apps, server);

  apps.map(({ name, path }) => (
    mountApp({ server, name, path: pathLib.join(path, 'internal') })
  ));

  server.use(
    express.static(publicPath)
  );

  startServer(server, port, 'Private');
};

module.exports = { mountExternal, mountInternal };
