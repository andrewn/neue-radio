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
    requestPlay: (url, type) => send('requestPlay', { url, type }),
    requestStop: () => send('requestStop', {})
  };

  ws.addEventListener('message', function(evt) {
    const msg = JSON.parse(evt.data);
    handler(msg);
  });

  return new Promise(resolve => {
    ws.addEventListener('open', function() {
      resolve(instance);
    });
  });
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
  console.log('incoming message', topic);
  switch (topic) {
    case 'playing':
      setState('playing');
      break;
    case 'stopped':
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
