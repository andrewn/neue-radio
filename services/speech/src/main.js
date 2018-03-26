const createWebSocket = require('websocket').default;

const log = require('debug')('speechd:main');

const connectToSpeechd = require('./speechd');
const handleMessage = require('./handleMessage');

const autoSpawn = !!process.env.NO_AUTO_SPAWN;

const main = async () => {
  try {
    const speech = await connectToSpeechd({ autoSpawn: !autoSpawn });
    const broker = createWebSocket();

    log('Connected to WebSocket');

    broker.subscribe(new RegExp('speech/.*'), handleMessage(speech, broker));

    speech.speak('Hello');
  } catch (e) {
    console.log('Error:', e);
  }
};

main();
