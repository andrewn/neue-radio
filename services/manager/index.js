const path = require('path');

const { findApps, knownApps } = require('./lib/apps');
const http = require('./lib/io/http');
const mountWebSocket = require('./lib/io/ws');
const listenForRestart = require('./lib/restart');

const webSocketPort = process.env.WEBSOCKET_PORT || 8000;
const internalPort = process.env.INTERNAL_PORT || 5001;
const externalPort = process.env.EXTERNAL_PORT || 5000;

const appPath = path.join('..', '..', 'apps');
const managerPublicPath = path.join(__dirname, 'public');

const apps = process.env.APP_PATH ?
  knownApps(__dirname)(process.env.APP_PATH) : findApps(__dirname)(appPath);

http.mountExternal(apps, externalPort);
http.mountInternal(apps, internalPort, managerPublicPath);

mountWebSocket(webSocketPort);
listenForRestart();
