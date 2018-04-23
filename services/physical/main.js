const ip = require('ip');
const { URL } = require('url');

const createPhysical = require('./lib/physical').create;
const createHttpServer = require('./lib/http-server').create;
const createWsClient = require('./lib/ws').create;
const port = process.env.PORT || 5200;
const configPath = process.env.CONFIG_PATH || './config/physical-config.json';

const config = require(configPath);

// Serve the demo page
const httpServer = createHttpServer();

// Allows the physical stuff to be controlled
// by sending messages over a websocket connection
const ws = createWsClient();

// Controls connected lights and buttons
// It subscrives for events from the websocket broker
// and publishes new messages back over the connection
createPhysical(ws, config);

// Start listening
httpServer.listen(port, function() {
  console.log('Listening on port: ', port);
});
