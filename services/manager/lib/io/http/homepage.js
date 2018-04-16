const mountHomepage = (_apps, server) => {
  server.get('/', (_req, res) =>
    res.sendFile('homepage.html', { root: __dirname })
  );
};

module.exports = mountHomepage;
