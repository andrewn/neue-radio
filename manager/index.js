const path = require('path');
const express = require('express');
var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , app = express()
  , wsport = 8000;


function mountAppWithName(instance, name, contentDir) {
  const mountAt = '/' + name;
  instance.use(mountAt, express.static(contentDir));
  console.log(name, 'mounted: ', mountAt, ' with dir: ', contentDir);
}

function listen(instance, port) {
  instance.listen(port, function () {
    console.log('Listening on port:', port);
  })
}

const appNamesToMount = [
  'manager',
  'radio'
];

const internal = express();
const internalPort = process.env.INTERNAL_PORT || 5001;

appNamesToMount.forEach(function (name) {
  const dirPath = path.join(__dirname, '..', name);
  mountAppWithName(internal, name, dirPath);
});

listen(internal, internalPort);

const external = express();
const externalPort = process.env.PORT || 5000;

appNamesToMount.forEach(function (name) {
  const dirPath = path.join(__dirname, '..', name, 'public');
  mountAppWithName(external, name, dirPath);
});

listen(external, externalPort);

/*
app.use(function (req, res) {
  res.send({ msg: "hello" });
});

*/

//see https://github.com/websockets/ws
wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
      wss.clients.forEach(function each(client) {
        console.log("sending to "+client);
        console.log(message);
        client.send(message);
      });
  });

});

server.listen(wsport, function () { console.log('Listening on ' + server.address().port) });
