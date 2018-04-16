const fs = require('fs');
const path = require('path');

const portsPath = path.resolve(
  __dirname,
  '../../../../../deployment/systemd/ports.env'
);

const readPorts = () => {
  var contents = fs.readFileSync(portsPath, 'utf8');

  return contents.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');

    return {
      ...acc,
      [key]: value
    };
  }, {});
};

module.exports = (appObj, server) => {
  const ports = readPorts();
  const apps = appObj.map(a => a.name).sort();

  const list = apps.map(a => ({
    name: `${a}`,
    type: 'app',
    internal: {
      path: `/${a}`,
      port: ports.MANAGER_INTERNAL_PORT
    },
    external: {
      path: `/${a}`,
      port: ports.MANAGER_EXTERNAL_PORT
    },
    path: `/${a}`
  }));

  const all = [
    { name: 'Setup', external: { port: ports.SETUP_PORT }, type: 'service' },
    { name: 'Debug', external: { port: ports.DEBUG_PORT }, type: 'service' },
    ...list
  ];

  server.get('/apps', (_req, res) => res.json(all));
};
