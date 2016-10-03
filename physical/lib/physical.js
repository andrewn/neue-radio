var five = require('johnny-five');
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


var uiConfig = require('../config/physical-config.json');

module.exports.create = function (router) {
  const io = new IO();
  // const msgClient = MessagingClient.create();
  // const publisher = msgClient.Publisher.create();

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

    types.forEach(function (type) {
      var specs = uiConfig[type];
      var factory = factories[type];
      if (specs && factory) {
        specs.forEach(function (spec) {
          const routable = router.register(type, spec.id);
          instances[type][spec.id] = factory(spec, routable);
        });
      } else {
        console.error("No config or factory for component type: ", type);
      }
    })

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
