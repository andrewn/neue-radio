const connect = require('./connect');
const Protocol = require('./protocol');

module.exports = async (...params) => {
  const connection = await connect(...params);
  return new Protocol(connection);
};
