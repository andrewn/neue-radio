const createPhysical = require('./lib/physical').create;
const createHttpServer = require('./lib/http-server').create;
const createWsServer = require('./lib/ws-server').create;
const Router = require('./lib/router');
const port = process.env.PORT || 5200;

// We use a router to connect the WebSockets with
// the physical UI so they don't need to know
// about each other. Later, other types of connection
// could be added.
const router = new Router();

// HTTP server listens on <port> for HTTP connections
// It does nothing at the moment but is required
// so that the WebSocket server can accept connections
const httpServer = createHttpServer();

// Upgrades HTTP connections to WebSockets
// Allows the physical stuff to be controlled
// by sending messages over a websocket connection
createWsServer(httpServer, router);

// Controls connected lights and buttons
// It listens for `message` events from the wsServer
// and publishes new messages back over the connection
createPhysical(router);

// Start listening
httpServer.listen(port, function() {
  console.log('Listening on port: ', port);
});
