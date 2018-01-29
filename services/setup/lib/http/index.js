const bodyParser = require('body-parser');
const express = require('express');

const http = ({ port, services }) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));

  app.get('/services', async (req, res) => {
    const list = await services.status();
    res.json(list);
  });

  app.post('/services', async (req, res) => {
    await services.set(req.body.services);
    res.redirect('/');
  });

  app.listen(
    port,
    () => console.log(`Radiodan setup app listening on port ${port}!`)
  );
};

module.exports = http;
