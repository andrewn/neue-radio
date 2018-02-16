const connectToSpeechd = require("./speechd");
const connectToBroker = require("./ws");

const WS_HOST = process.env.WS_HOST;
const WS_PORT = process.env.WS_PORT;

const handleMessage = speech => (topic, payload) => {
  switch (topic) {
    case "speech.command.speak":
      speech.speak(payload.utterance);
      break;
  }
};

const main = async () => {
  try {
    const speech = await connectToSpeechd({ autoSpawn: true });
    const broker = await connectToBroker(WS_HOST, WS_PORT);

    broker.on("message", handleMessage(speech));
    broker.on("close", () => process.exit());

    speech.speak("Hello");
  } catch (e) {
    console.log("Error:");
    console.error(e);
  }
};

main();
