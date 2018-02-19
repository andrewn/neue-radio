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
          topic: "speech/event/availablevoices",
          payload: {
            voices: await speech.listVoices()
          }
        });
        break;
    }
  } catch (e) {
    console.log("Error handling action", e);
  }
};
