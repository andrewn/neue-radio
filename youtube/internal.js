let ws = null;

const createComms = async handler => {
  const ws = new WebSocket('ws://' + location.hostname + ':8000');

  const send = (topic, payload) => {
    ws.send(
      JSON.stringify({
        topic,
        payload
      })
    );
  };

  const instance = {
    downloadMedia: url => {
      // send('mediaRequest', { url })
      handler({ topic: 'mediaAvailable', payload: { url } });
    }
  };

  ws.addEventListener('message', function(evt) {
    const msg = JSON.parse(evt.data);
    handler(msg);
  });

  return new Promise((resolve, reject) => {
    ws.addEventListener('open', function(evt) {
      resolve(instance);
    });
  });
};

const playMedia = url => {
  const mediaEl = document.querySelector('.media');
  mediaEl.src = url;
  mediaEl.play();
};

const handleMessage = comms => ({ topic, payload }) => {
  console.log(topic, payload);
  switch (topic) {
    case 'requestPlay':
      comms.downloadMedia(payload.url);
      break;
    case 'mediaAvailable':
      playMedia(payload.url);
      break;
  }
};

const init = async () => {
  const comms = await createComms(msg => handleMessage(comms)(msg));
};

init();
