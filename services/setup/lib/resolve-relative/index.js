const path = require('path');

const resolveRelative = rootPath => relativePath => (
  path.resolve(rootPath, relativePath)
);

module.exports = resolveRelative;
