const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = defaultLabel => printf(info => {
  return `${info.timestamp} [${info.label || defaultLabel}] ${info.level}: ${info.message}`;
});

module.exports = (label) => (
  createLogger({
    format: combine(
      timestamp(),
      myFormat(label)
    ),
    transports: [new transports.Console()]
  })
);
