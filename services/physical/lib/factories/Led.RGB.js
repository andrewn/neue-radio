const five = require('johnny-five');

module.exports = function createLedRGBInstance(spec, routable) {
  const id = spec.id;
  const config = spec.config;

  const rgb = five.Led.RGB(Object.assign({ id: id }, config));

  routable.on('request', function(req) {
    var stateChangePromise;

    console.log('RGBLED request', req);

    switch (req.command) {
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
          req.params.on === true ? rgb.on() : rgb.off();
        }
        stateChangePromise = Promise.resolve();
    }

    stateChangePromise.then(function() {
      // TODO: Do we want to allow responses?
      // worker.respond(req.sender, req.correlationId, {error: false});
    });
  });

  return rgb;
};
