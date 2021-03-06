const createWebsocket = require('websocket');
const shutdown = () => process.exit(1);

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
