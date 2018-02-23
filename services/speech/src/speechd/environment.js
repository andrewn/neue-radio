const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const { ExecutableNotFoundError } = require("./errors");

const getExecutablePath = async () => {
  try {
    const { stdout } = await exec(`which speech-dispatcher`);
    return stdout.trim();
  } catch (e) {
    if (e.code === 1) {
      throw new ExecutableNotFoundError();
    } else {
      throw e;
    }
  }
};

const getSocketPath = () =>
  process.env.SOCKET_PATH ||
  `${process.env.XDG_RUNTIME_DIR}/speech-dispatcher/speechd.sock`;

module.exports = {
  getExecutablePath,
  getSocketPath
};
