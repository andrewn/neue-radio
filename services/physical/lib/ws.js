const createWebsocket = require('websocket');

const webSocket = router => {
  const ws = createWebsocket();

  ws.ready.then(() => console.info('Listening to web socket'));

  ws.subscribe(new RegExp('.*'), ({ topic, payload }) => {
    router.route(topic, payload);
  });

  router.on('publish', ws => ({ topic, payload }) =>
    ws.publish({ topic, payload })
  );
};

module.exports.create = webSocket;
