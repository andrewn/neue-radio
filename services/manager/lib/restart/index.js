const createWebsocket = require('websocket').default;
const shutdown = () => process.exit(0);

const listenForRestart = () => {
  createWebsocket()
    .subscribe('manager/command/restart', shutdown);
};

module.exports = listenForRestart;
