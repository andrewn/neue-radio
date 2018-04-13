const serial = require('./serial');
const debug = require('debug')('serial:router');

const command = name => `serial/command/${name}`;
const event = name => `serial/event/${name}`;

const publisher = ws => (topic, payload) => {
  ws.publish({
    topic,
    payload
  });
};

const handler = (publish, action, topic) => async ({ payload }) => {
  try {
    const result = await action(payload);
    debug(topic, result);
    publish(topic, result);
  } catch (error) {
    debug(topic, error);
    publish(topic, { error });
  }
};

/*
  Routes messages from WebSocket to serial port
*/
module.exports = ({ websocket }) => {
  const publish = publisher(websocket);

  serial.onReceive(payload => {
    publish(event('receive'), payload);
  });

  serial.onOpen(payload => {
    publish(event('open'), payload);
  });

  serial.onClose(payload => {
    publish(event('close'), payload);
  });

  websocket.subscribe(
    command('list'),
    handler(publish, serial.list, event('list'))
  );

  websocket.subscribe(
    command('open'),
    handler(publish, serial.open, event('open'))
  );

  websocket.subscribe(
    command('close'),
    handler(publish, serial.close, event('close'))
  );

  websocket.subscribe(
    command('send'),
    handler(publish, serial.write, event('send'))
  );
};
