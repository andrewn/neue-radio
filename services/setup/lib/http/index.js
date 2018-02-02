const bodyParser = require('body-parser');
const express = require('express');

const http = ({ port, apps, services }) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));

  app.get('/apps', async (req, res) => {
    const list = await apps.status();
    res.json(list);
  });

  app.post('/apps', async (req, res) => {
    await apps.set(req.body.apps);
    res.redirect('/?update=true');
  });

  app.get('/services', async (req, res) => {
    const list = await services.status();
    res.json(list);
  });

  app.post('/services', async (req, res) => {
    await services.set(req.body.services);
    res.redirect('/?update=true');
  });

  app.listen(
    port,
    () => console.log(`Radiodan setup app listening on port ${port}!`)
  );
};

module.exports = http;
