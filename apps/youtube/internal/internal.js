const DEBUG =
  new URL(window.location.href).searchParams.get('debug') === 'true';

const createComms = async handler => {
  const ws = createWebsocket();

  const send = (topic, payload = {}) => {
    ws.publish({ topic, payload });
  };

  const instance = {
    downloadMedia: url => {
      DEBUG
        ? handler({ topic: 'downloader/event/available', payload: { url } })
        : send('downloader/command/request', { url });
    },
    playing: url => {
      send('youtube/event/playing', { url });
    },
    stopped: () => {
      send('youtube/event/stopped');
    }
  };

  ws.subscribe(new RegExp('youtube/command/.*'), handler);
  ws.subscribe('downloader/event/available', handler);

  return ws.ready.then(() => (instance));
};

const playMedia = url => {
  const mediaEl = document.querySelector('.media');
  mediaEl.src = url;
  mediaEl.play();
};

const stopAll = () => {
  const mediaEl = document.querySelector('.media');
  mediaEl.pause();

  stopYouTube();
};

const youtube = new YouTube(document.body);

const playYouTubeDirectly = url => youtube.play(url);

const stopYouTube = () => youtube.stop();

const handleMessage = comms => ({ topic, payload }) => {
  console.log(topic, payload);
  switch (topic) {
    case 'youtube/command/play':
      if (payload.type === 'download') {
        comms.downloadMedia(payload.url);
      } else if (payload.type === 'direct') {
        playYouTubeDirectly(payload.url);
        comms.playing();
      }
      break;
    case 'youtube/command/stop':
      stopAll();
      comms.stopped();
      break;
    case 'downloader/event/available':
      playMedia(payload.url);
      comms.playing(payload.sourceUrl);
      break;
  }
};

const init = async () => {
  console.log('YouTube app:init. DEBUG? ', DEBUG);
  const comms = await createComms(msg => handleMessage(comms)(msg));
};

init();
