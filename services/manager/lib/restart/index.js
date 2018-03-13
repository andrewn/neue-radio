const createWebsocket = require('websocket').default;
const shutdown = () => process.exit(0);

const listenForRestart = () => {
  const ws = createWebsocket();

  ws.ready.then(() => {
    // reload page running internal apps from the manager
    setTimeout(() => {
      ws.publish({ topic: 'manager-web/command/restart' });
    }, 1000);
  });

  ws.subscribe('manager/command/restart', shutdown);
};

module.exports = listenForRestart;
