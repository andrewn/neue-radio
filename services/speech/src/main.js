const ip = require("ip");

const log = require("debug")("speechd:main");

const connectToSpeechd = require("./speechd");
const connectToBroker = require("./ws");
const handleMessage = require("./handleMessage");

const WS_HOST = process.env.WS_HOST || ip.address();
const WS_PORT = process.env.WS_PORT;

const main = async () => {
  try {
    const speech = await connectToSpeechd({ autoSpawn: true });
    const broker = await connectToBroker(WS_HOST, WS_PORT);

    log("Connecting to broker with WS_HOST: ", WS_HOST, " WS_PORT:", WS_PORT);

    broker.on("message", handleMessage(speech, broker));
    broker.on("close", () => process.exit());

    speech.speak("Hello");
  } catch (e) {
    console.log("Error:", e);
  }
};

main();
