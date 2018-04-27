const five = require('johnny-five');

module.exports = function(spec, routable) {
  const id = spec.id;
  const config = spec.config;

  const matrix = five.Led.Matrix(Object.assign({ id: id }, config));

  routable.on('draw', function(req) {
    if (req.data && Array.isArray(req.data)) {
      try {
        matrix.draw(req.data);
      } catch (error) {
        console.error(id, error);
      }
    }
  });
};
