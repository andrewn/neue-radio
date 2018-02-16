import createWebsocket from '/websocket';

const createComms = async handler => {
  const ws = createWebsocket();

  const send = (topic, payload = {}) => {
    ws.publish({ topic: `youtube/command/${topic}`, payload });
  };

  const instance = {
    requestPlay: (url, type) => send('play', { url, type }),
    requestStop: () => send('stop')
  };

  ws.subscribe(new RegExp('youtube/event/.*'), (msg) => {
    handler(msg);
  });

  return ws.ready.then(() => (instance));
};

const setState = id => {
  document.querySelector('root').dataset.state = id;
};

const onFormSubmit = handler => {
  document.querySelector('form').addEventListener('submit', evt => {
    evt.preventDefault();

    console.log('onFormSubmit');

    const download = document.querySelector('input.download').checked;

    const url = document.querySelector('input.url').value;
    if (url != '') {
      handler({ url, download });
    }
  });
};

const onStopClick = handler => {
  console.log('stop', document.querySelector('button.stop'));

  document.querySelector('button.stop').addEventListener('click', evt => {
    evt.preventDefault();
    handler();
  });
};

const handleMessage = ({ topic }) => {
  switch (topic) {
    case 'youtube/event/playing':
      setState('playing');
      break;
    case 'youtube/event/stopped':
      setState('ready');
      break;
  }
};

const init = async () => {
  console.log('init');

  setState('ready');

  const comms = await createComms(handleMessage);

  onFormSubmit(({ url, download }) => {
    comms.requestPlay(url, download ? 'download' : 'direct');
    setState('requested');
  });

  onStopClick(() => {
    comms.requestStop();
  });
};

init();
