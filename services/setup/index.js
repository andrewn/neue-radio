const path = require('path');

const http = require('./lib/http');
const createServices = require('./lib/services');
const createServicesList = require('./lib/services-list')

const app = async () => {
  const servicesList = await createServicesList(__dirname);

  const port = process.env.PORT || 3000;

  const servicesRunPath = path.resolve(
    __dirname,
    process.env.SERVICES_PATH || './services',
  );

  const services = createServices({ path: servicesRunPath, available: servicesList });

  http({ port, services });
};

app();
