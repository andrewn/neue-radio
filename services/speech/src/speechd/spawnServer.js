const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const { getExecutablePath } = require("./environment");

module.exports = async () => {
  const path = await getExecutablePath();

  try {
    return await exec(path);
  } catch (e) {
    return null;
  }
};
