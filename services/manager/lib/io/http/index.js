const express = require('express');
const ip = require('ip');
const pathLib = require('path');

const mountApp = ({ server, name, path }) => {
  const mountAt = `/${name}`;

  server.use(mountAt, express.static(path));
};

const mountAppList = (apps, server) => {
  const appNames = apps.map( a => a.name );

  server.get('/', (req, res) =>
    res.json({
      apps: appNames,
    })
  );

  console.log('Mounted apps', appNames);
};

const startServer = (server, port, name) => {
  server.listen(port, () => (
    console.log(`${name} Server http://${ip.address()}:${port}`)
  ));
};

const mountExternal = (apps, port, index) => {
  const server = express();

  apps.map(({ name, path }) => (
    mountApp({ server, name, path })
  ));

  mountAppList(apps, server);
  startServer(server, port, 'Public');
};

const mountInternal = (apps, port, publicPath) => {
  const server = express();

  apps.map(({ name, path }) => {
    mountApp({ server, name, path: pathLib.join(path, 'public') })
  });

  server.use(
    express.static(publicPath)
  );

  startServer(server, port, 'Private');
};

module.exports = { mountExternal, mountInternal };
