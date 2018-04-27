const getConfig = require('../config');

module.exports = server =>
  server.get('/config', async (req, res) => {
    res.json(await getConfig());
  });
