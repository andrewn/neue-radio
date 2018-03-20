const appName = window.location.pathname.replace(/\//g,'');

const main = async () => {
  const websocket = createWebsocket();

  websocket.ready.then(() => {
    console.log('Websocket connected');

    websocket.publish({
      topic: `${appName}/event/ready`,
      payload: { msg: 'Internal app ready!' },
    });
  });

  websocket.subscribe(
    new RegExp(`${appName}/.*`),
    ({ topic, payload }) => {
      console.log('Recieved message', topic, payload);
    }
  );

  console.log('Internal app loaded');
};

main();
