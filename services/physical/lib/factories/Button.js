const five = require('johnny-five');

module.exports = function createButtonInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;
  // const topicKey = 'event.button.' + id;
  const button = new five.Button(Object.assign({ id: id }, config));

  button.on('press', function() {
    console.log(id + ': Button pressed');
    routable.publish('press', { pressed: true });
  });

  button.on('hold', function() {
    console.log(id + ': Button held');
    routable.publish('hold', { pressed: true, durationMs: button.holdtime });
  });

  button.on('release', function() {
    console.log(id + ': Button released');
    routable.publish('release', { pressed: false });
  });

  return button;
};
