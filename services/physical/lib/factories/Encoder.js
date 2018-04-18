let RotaryEncoder;

try {
  RotaryEncoder = require('raspi-rotary-encoder').RotaryEncoder;
} catch (err) {
  console.error('raspi-rotary-encoder not found, falling back to mock');
  console.error(err);
  RotaryEncoder = function() {
    return {
      on: function() {}
    };
  };
}

module.exports = function createEncoderInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;
  // const topicKey = 'event.rotary-encoder.' + id + '.turn';

  const encoder = new RotaryEncoder(Object.assign({ id: id }, config));

  // the encoder will try to work out where in the loop you are
  encoder.on('change', function(evt) {
    routable.publish('turn', evt);
  });
};
