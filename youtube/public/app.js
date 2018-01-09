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
    requestPlay: url => send('requestPlay', { url })
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

const onFormSubmit = handler => {
  document.querySelector('form').addEventListener('submit', evt => {
    evt.preventDefault();

    const value = document.querySelector('input[type="text"]').value;
    if (value != '') {
      handler(value);
    }
  });
};

const handleMessage = msg => console.log(msg);

const init = async () => {
  console.log('init');
  const comms = await createComms(handleMessage);
  onFormSubmit(url => comms.requestPlay(url));
};

init();
