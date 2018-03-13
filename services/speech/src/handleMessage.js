const actions = {
  speak: async (speech, broker, topic, payload) => {
    if (payload.voiceType) {
      await speech.setVoiceType(payload.voiceType);
    }

    speech.speak(payload.utterance);
  },
  listVoices: async (speech, broker) => {
    broker.publish({
      topic: "speech/event/availablevoices",
      payload: {
        voices: await speech.listVoices()
      }
    });
  }
};

module.exports = (speech, broker) => async ({ topic, payload }) => {
  let action = null;

  try {
    switch (topic) {
      case "speech/command/speak":
        action = actions.speak;
        break;
      case "speech/command/listvoices":
        action = actions.listVoices;
        break;
    }

    action(speech, broker, topic, payload);
  } catch (e) {
    console.log("Error handling action", e);
  }
};
