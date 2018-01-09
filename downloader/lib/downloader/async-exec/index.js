const { exec } = require('child_process');

const asyncExec = cmd => (
  new Promise((resolve, reject) => (
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      resolve(stdout);
    })
  ))
);

module.exports = asyncExec;
