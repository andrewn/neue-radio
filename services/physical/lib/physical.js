var five = require('johnny-five');
var pigpio = require('pigpio');
var EchoIO = require('./echo-io');
var factories = require('./factories');

var IO = null;

try {
  IO = require('raspi-io');
} catch (err) {
  console.error('Raspi-io not found, falling back to EchoIO');
  console.error(err);
  IO = EchoIO;
}

function eachItem(config, cb) {
  Object.entries(config).forEach(([type, items = []]) => {
    items.forEach(item => cb(type, item));
  });
}

function collectPinNumbers(config) {
  const pins = [];

  eachItem(config, (type, spec) => {
    if (spec.config && spec.config.pin) {
      pins.push(spec.config.pin);
    } else if (spec.config && spec.config.pins) {
      pins.push(...Object.values(spec.config.pins));
    }
  });

  return pins;
}

module.exports.create = function(router, uiConfig) {
  // Tells the underlying gpio library to use the
  // PWM pin as a clock source, rather than the PCM
  // pin that provides I2S audio to DACs
  pigpio.configureClock(5 /* pigpio's default duty cycle */, pigpio.CLOCK_PWM);

  const io = new IO({
    enableSoftPwm: true,
    // Only enable pins used in the config
    // to avoid clashing with other components
    includePins: collectPinNumbers(uiConfig)
  });

  var board = new five.Board({
    io: io,
    repl: false
  });

  var types = Object.keys(factories);

  var instances = {};
  types.forEach(function(type) {
    instances[type] = {};
  });

  board.on('ready', function() {
    console.log('Board is ready');

    eachItem(uiConfig, (type, spec) => {
      const factory = factories[type];

      if (spec && factory) {
        const routable = router.register(type, spec.id);
        instances[type][spec.id] = factory(spec, routable);
      } else {
        console.error('No config or factory for component type: ', type);
      }
    });

    if (this.repl) {
      this.repl.inject(Object.assign({ io: io, five: five }, instances));
    }
  });
};
