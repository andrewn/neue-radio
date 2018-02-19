module.exports = (speech, broker) => async ({ topic, payload }) => {
  try {
    switch (topic) {
      case "speech/command/speak":
        if (payload.voiceType) {
          await speech.setVoiceType(payload.voiceType);
        }
        speech.speak(payload.utterance);
        break;
      case "speech/command/listvoices":
        broker.publish({
          topic: "speech/event/voices",
          payload: {
            available: await speech.listVoices(),
            current: await speech.getVoiceType()
          }
        });
        break;
      case "speech/command/listoutputmodules":
        broker.publish({
          topic: "speech/event/outputmodules",
          payload: {
            available: await speech.listOutputModules(),
            current: await speech.getOutputModule()
          }
        });
        break;
      case "speech/command/outputmodule":
        speech.setOutputModule(payload.outputModule);
        broker.publish({
          topic: "speech/event/outputmodules",
          payload: {
            available: await speech.listOutputModules(),
            current: await speech.getOutputModule()
          }
        });
        break;
    }
  } catch (e) {
    console.log("Error handling action", e);
  }
};
