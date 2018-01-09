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
    requestPlay: url => send('requestPlay', { url }),
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

const setState = id => {
  document.querySelector('root').dataset.state = id;
};

const onFormSubmit = handler => {
  document.querySelector('form').addEventListener('submit', evt => {
    evt.preventDefault();

    console.log('onFormSubmit');

    const value = document.querySelector('input.url').value;
    if (value != '') {
      handler(value);
    }
  });
};

const handleMessage = ({ topic, payload }) => {
  console.log('incoming message', topic);
  switch (topic) {
    case 'playing':
      setState('playing');
      break;
  }
};

const init = async () => {
  console.log('init');

  setState('ready');

  const comms = await createComms(handleMessage);

  onFormSubmit(url => {
    comms.requestPlay(url);
    setState('requested');
  });

};

init();
