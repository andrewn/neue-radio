const exec = require("child_process").exec;

const getExecutablePath = async () =>
  new Promise((resolve, reject) => {
    exec(`which speech-dispatcher`, (error, stdout) => {
      error ? reject(error) : resolve(stdout);
    });
  });

const getSocketPath = () =>
  `${process.env.XDG_RUNTIME_DIR}/speech-dispatcher/speechd.sock`;

module.exports = {
  getExecutablePath,
  getSocketPath
};
