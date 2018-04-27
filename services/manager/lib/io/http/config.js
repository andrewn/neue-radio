const getConfig = require('../config');

module.exports = server =>
  server.get('/config', async (req, res) => {
    const json = await getConfig();
    res.json(json || {});
  });
