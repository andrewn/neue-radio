var five = require('johnny-five');
var pigpio = require('pigpio');
var EchoIO = require('./echo-io');

var IO = null;
var RotaryEncoder;

try {
  IO = require('raspi-io');
} catch(err) {
  console.error('Raspi-io not found, falling back to EchoIO');
  console.error(err);
  IO = EchoIO;
}

try {
  RotaryEncoder = require('raspi-rotary-encoder').RotaryEncoder
} catch(err) {
  console.error('raspi-rotary-encoder not found, falling back to mock');
  console.error(err);
  RotaryEncoder = function () {
    return {
      on: function () {}
    }
  };
}


function eachItem(config, cb) {
  Object
    .entries(config)
    .forEach(
      ([type, items = []]) => {
        items.forEach(
          item => cb(type, item)
        )
      }
    )
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


module.exports.create = function (router, uiConfig) {
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

  var types = ['Button', 'Led.RGB', 'Encoder'];

  var instances = {};
  types.forEach(function (type) {
    instances[type] = {};
  });

  var factories = {
    'Button': createButtonInstance,
    'Led.RGB': createLedRGBInstance,
    'Encoder': createEncoderInstance
  };

  board.on('ready', function() {
    console.log('Board is ready');

    eachItem(
      uiConfig, 
      (type, spec) => {
        const factory = factories[type];

        if (spec && factory) {
          const routable = router.register(type, spec.id);
          instances[type][spec.id] = factory(spec, routable);
        } else {
          console.error("No config or factory for component type: ", type);
        }
      }
    );

    if (this.repl) {
      this.repl.inject(Object.assign(
        { io: io, five: five },
        instances
      ));
    }
  });
}

function createButtonInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;
  // const topicKey = 'event.button.' + id;
  const button = new five.Button(Object.assign({ id: id }, config));

  button.on("press", function() {
    console.log( id + ": Button pressed" );
    routable.publish('press', { pressed: true });
  });

  button.on("hold", function() {
    console.log( id + ": Button held" );
    routable.publish('hold', { pressed: true, durationMs: button.holdtime });
  });

  button.on("release", function() {
    console.log( id + ": Button released" );
    routable.publish('release', { pressed: false });
  });

  return button;
};

function createLedRGBInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;
  // const topicKey = 'command.rgb-led.' + id;
  // const workerId = 'radiodan-physical-ui-rgbled-' + id;

  // const worker = msgClient.Worker.create(workerId);

  const rgb = five.Led.RGB(Object.assign({ id: id }, config));

  // worker.addService({
  //   serviceType: 'rgb-led',
  //   serviceInstances: [id]
  // });
  //
  // worker.ready();

  routable.on('request', function (req) {
    var stateChangePromise;

    console.log('RGBLED request', req);

    switch(req.command) {
      // case 'change':
      //   req.params.queue = req.params.queue || [];
      //
      //   stateChangePromise = promise.all(
      //     req.params.queue.map(function (params, index) {
      //       params.chain = index > 0;
      //       return changeRgbState(rgb, params);
      //     })
      //   );
      //   break;
      case 'status':
        stateChangePromise = Promise.resolve({ color: rgb.color() });
        break;
      default:
        if (req.params.color) {
          rgb.color(req.params.color);
        }
        if (req.params.on != null) {
          (req.params.on === true) ? rgb.on() : rgb.off();
        }
        stateChangePromise = Promise.resolve();
    }

    stateChangePromise.then(
      function () {
        // TODO: Do we want to allow responses?
        // worker.respond(req.sender, req.correlationId, {error: false});
      }
    );

  });

  return rgb;
}

function createEncoderInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;
  // const topicKey = 'event.rotary-encoder.' + id + '.turn';

  const encoder = new RotaryEncoder(Object.assign({ id: id }, config));

  // the encoder will try to work out where in the loop you are
  encoder.on('change', function (evt) {
    routable.publish('turn', evt);
  });
}
