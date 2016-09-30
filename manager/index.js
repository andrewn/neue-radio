const path = require('path');
const express = require('express');


function mountAppWithName(instance, name, contentDir) {
  const mountAt = '/' + name;
  instance.use(mountAt, express.static(contentDir));
  console.log(name, 'mounted: ', mountAt, ' with dir: ', contentDir);
}

function listen(instance, port) {
  instance.listen(port, function () {
    console.log('Listening on port:', port);
  })
}

const appNamesToMount = [
  'manager',
  'radio'
];

const internal = express();
const internalPort = process.env.INTERNAL_PORT || 5001;

appNamesToMount.forEach(function (name) {
  const dirPath = path.join(__dirname, '..', name);
  mountAppWithName(internal, name, dirPath);
});

listen(internal, internalPort);

const external = express();
const externalPort = process.env.PORT || 5000;

appNamesToMount.forEach(function (name) {
  const dirPath = path.join(__dirname, '..', name, 'public');
  mountAppWithName(external, name, dirPath);
});

listen(external, externalPort);
