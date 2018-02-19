const createWebSocket = require("websocket").default;

const log = require("debug")("speechd:main");

const connectToSpeechd = require("./speechd");
const handleMessage = require("./handleMessage");

const main = async () => {
  try {
    const speech = await connectToSpeechd({ autoSpawn: true });
    const broker = createWebSocket();

    await broker.ready;

    log("Connected to WebSocket");

    broker.subscribe(new RegExp("speech/.*"), handleMessage(speech, broker));

    speech.speak("Hello");
  } catch (e) {
    console.log("Error:", e);
  }
};

main();
