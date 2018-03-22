const exec = require("child_process").exec;
const path = require('path');

const updateBinaryPath = path.resolve(
  __dirname,
  path.join('..', '..', '..', '..', 'deployment', 'update')
);

const installer = () => (
  new Promise((resolve, reject) => {
    exec(
      updateBinaryPath,
      { env: { ...process.env, PLAIN: true } },
      (error, stdout, stderr) => {
        const response = stdout + stderr;

        if(error && error.code > 1) {
          reject(response);
        } else {
          resolve(response);
        }
      }
    );
  })
);

module.exports = installer;
