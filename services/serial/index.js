const SerialPort = require('serialport');
const createWebsocket = require('websocket');

const DELIMETER = '\n\r';

const writer = port => async message => {
  return new Promise((resolve, reject) => {
    if (message == null) {
      console.log('Will not write null message ', message);
      return;
    }
    console.log(`write: "${message}"`);
    port.write(`${message}${DELIMETER}`, function(err) {
      err ? reject(err) : resolve();
    });
  });
};

function main({ serialPath }) {
  const port = new SerialPort(serialPath, {
    baudRate: 115200
  });

  const write = writer(port);
  const ws = createWebsocket();

  // Open errors will be emitted as an error event
  port.on('error', function(err) {
    console.log('Error: ', err.message);
    process.exit(1);
  });

  // If the serial disconnects, exit the process
  port.on('close', function() {
    process.exit(1);
  });

  ws.subscribe('serial/command/write', async ({ payload }) => {
    try {
      await write(payload.data);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  });

  port.on('data', function(data) {
    ws.publish({
      topic: 'serial/event/received',
      payload: { data: data.toString() }
    });
  });
}

const SERIAL_PATH = process.env.SERIAL_PATH;

if (SERIAL_PATH == null) {
  console.error(`Specify a SERIAL_PATH to connect to`);
  process.exit(1);
}

main({ serialPath: SERIAL_PATH });
