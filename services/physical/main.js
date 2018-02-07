const ip = require('ip');
const { URL } = require('url');

const createPhysical = require('./lib/physical').create;
const createHttpServer = require('./lib/http-server').create;
const createWsClient = require('./lib/ws').create;
const Router = require('./lib/router');
const port = process.env.PORT || 5200;

const host = new URL(`http://${ip.address()}`);

// We use a router to connect the WebSockets with
// the physical UI so they don't need to know
// about each other. Later, other types of connection
// could be added.
const router = new Router();

// Serve the demo page
const httpServer = createHttpServer();

// Allows the physical stuff to be controlled
// by sending messages over a websocket connection
createWsClient(host, router);

// Controls connected lights and buttons
// It listens for `message` events from the wsServer
// and publishes new messages back over the connection
createPhysical(router);

// Start listening
httpServer.listen(port, function() {
  console.log('Listening on port: ', port);
});
