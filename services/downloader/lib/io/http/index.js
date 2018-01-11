const express = require('express');
const serveIndex = require('serve-index')

const web = ({ port, publicPath }) => {
  const app = express();
  const serveStatic = express.static(publicPath);

  app.use(serveStatic)

  app.use(
    '/videos',
    serveIndex(publicPath, {'icons': true}),
    serveStatic,
  );

  app.get('/', (req, res) => {
    res.send('Video Download Service');
  });

  console.log(`server available at port ${port}`);
  app.listen(port);
};

module.exports = web;
