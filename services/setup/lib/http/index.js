const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const mountWebsocket = (app) => {
  const wsPath = path.dirname(require.resolve('websocket'));
  const serveStatic = express.static(wsPath, { index: 'index.js' });

  app.use('/websocket', serveStatic);
};

const http = ({ port, apps, services, installer }) => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));

  mountWebsocket(app);

  app.get('/apps', async (req, res) => {
    const list = await apps.status();
    res.json(list);
  });

  app.post('/apps', async (req, res) => {
    await apps.set(req.body.apps);
    res.redirect('/?update=apps');
  });

  app.get('/services', async (req, res) => {
    const list = await services.status();
    res.json(list);
  });

  app.post('/services', async (req, res) => {
    await services.set(req.body.services);
    res.redirect('/?update=services');
  });

  app.post('/dependencies', async (req, res) => {
    const installText = await installer();
    res.json(installText);
  });

  app.listen(
    port,
    () => console.log(`Radiodan setup app listening on port ${port}!`)
  );
};

module.exports = http;
