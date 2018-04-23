const five = require('johnny-five');

module.exports = function createLedRGBInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;

  const rgb = five.Led.RGB(Object.assign({ id: id }, config));

  routable.on('change', function(payload) {
    if (payload.color) {
      rgb.color(payload.color);
    }

    if (payload.isOn != null) {
      payload.isOn === true ? rgb.on() : rgb.off();
    }
  });

  routable.on('status', function() {
    routable.publish('status', {
      color: rgb.color(),
      isOn: rgb.isOn()
    });
  });

  return rgb;
};
