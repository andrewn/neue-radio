let connectRaspiCap;

try {
  connectRaspiCap = require('raspi-cap').connect;
} catch (err) {
  console.error('raspi-cap not found, falling back to mock');
  console.error(err);
  connectRaspiCap = function() {
    return new Promise.resolve({ on: () => {} });
  };
}

module.exports = function createCapInstance(spec, routable) {
  connectRaspiCap({ resetPin: spec.config.resetPin }).then(cap => {
    // Listen for messages from clients
    routable.on('reset-request', function() {
      try {
        cap.reset();
      } catch (e) {
        console.error(e);
      }
    });

    routable.on('status-request', function() {
      routable.publish('status', { sensitivity: cap.getSensitivity() });
    });

    routable.on('sensitivity', function(req) {
      try {
        cap.setSensitivity(req.level);
        routable.publish('status', { sensitivty: cap.getSensitivity() });
      } catch (e) {
        console.error(e);
      }
    });

    cap.on('reset', function() {
      routable.publish('reset', {});
    });

    cap.on('change', function(evt) {
      routable.publish('change', evt);
    });
  });
};
