const path = require('path');
const express = require('express');
const fs = require('fs');
const ws = require('ws');
const http = require('http');

const server = http.createServer();
const WebSocketServer = ws.Server;
const wss = new WebSocketServer({ server: server });
const wsport = 8000;

const isDirectory = ({ path }) => fs.lstatSync(path).isDirectory();
const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => ({ path: path.join(source, name), name }))
    .filter(isDirectory)
    .map(({ name }) => name);

const rootPath = path.resolve(__dirname, '..');
const managerId = 'manager';
const unmountableDirectories = ['.git', 'systemd', 'physical'];
const appNamesToMount = getDirectories(rootPath).filter(
  dir => !unmountableDirectories.includes(dir)
);

function mountAppWithName(instance, name, contentDir) {
  const mountAt = '/' + name;
  instance.use(mountAt, express.static(contentDir));
  console.log(name, 'mounted: ', mountAt, ' with dir: ', contentDir);
}

function listen(instance, port) {
  instance.listen(port, function() {
    console.log('Listening on port:', port);
  });
}

const internal = express();
const internalPort = process.env.INTERNAL_PORT || 5001;

appNamesToMount.forEach(function(name) {
  const dirPath = path.join(__dirname, '..', name);
  mountAppWithName(internal, name, dirPath);
});

internal.get('/', (req, res) =>
  res.json({
    apps: appNamesToMount.filter(id => id != managerId).map(id => ({ id }))
  })
);

listen(internal, internalPort);

const external = express();
const externalPort = process.env.PORT || 5000;

appNamesToMount.forEach(function(name) {
  const dirPath = path.join(__dirname, '..', name, 'public');
  mountAppWithName(external, name, dirPath);
});

listen(external, externalPort);

//see https://github.com/websockets/ws
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.clients.forEach(function each(client) {
      console.log('sending to ' + client);
      console.log(message);
      client.send(message);
    });
  });
});

server.listen(wsport, function() {
  console.log('Listening on ' + server.address().port);
});
