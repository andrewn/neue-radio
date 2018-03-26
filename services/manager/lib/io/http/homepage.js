const fs = require('fs');
const path = require('path');

const portsPath = path.resolve(
  __dirname,
  '../../../../../deployment/systemd/ports.env'
);

const readPorts = () => {
  var contents = fs.readFileSync(portsPath, 'utf8');

  return contents.split("\n").reduce((acc, line) => {
    const [key, value] = line.split('=');

    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

const appList = (appObj) => {
  const ports = readPorts();
  const apps = appObj.map( a => a.name ).sort();

  const internalApps = apps.map((a) => ({
    name: `${a} (internal)`,
    port: ports.MANAGER_INTERNAL_PORT,
    path: `/${a}`,
  }))

  const externalApps = apps.map((a) => ({
    name: `${a} (external)`,
    port: ports.MANAGER_EXTERNAL_PORT,
    path: `/${a}`,
  }))

  return [
    { name: 'Setup', port: ports.SETUP_PORT },
    { name: 'Debug', port: ports.DEBUG_PORT },
    ...internalApps,
    ...externalApps,
  ];
};

const mountHomepage = (apps, server) => {
  server.get('/', (_req, res) => res.sendFile('homepage.html', { root: __dirname }));
  server.get('/apps', (_req, res) => res.json(appList(apps)));
};

module.exports = mountHomepage;
