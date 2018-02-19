module.exports = (speech, broker) => async (topic, payload) => {
  try {
    switch (topic) {
      case "speech.command.speak":
        if (payload.voiceType) {
          await speech.setVoiceType(payload.voiceType);
        }
        speech.speak(payload.utterance);
        break;
      case "speech.command.list-voices":
        broker.send("speech.event.available-voices", {
          voices: await speech.listVoices()
        });
        break;
    }
  } catch (e) {
    console.log("Error handling action", e);
  }
};
