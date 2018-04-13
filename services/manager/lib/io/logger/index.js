const chalk = require('chalk');

const levelColour = (level = 'log') =>
  ({
    log: chalk.green
  }[level]);

const log = (level, prefix, message, ...params) => {
  const formattedPrefix = `[${levelColour(level)(prefix)}]`;
  console.log(formattedPrefix, message, ...params);
};

const create = level => (prefix, message, ...params) => {
  if (message == null) {
    return log.bind(null, level, prefix);
  }

  return log(level, prefix, message, ...params);
};

module.exports = {
  bold: chalk.bold,
  log: create('log')
};
