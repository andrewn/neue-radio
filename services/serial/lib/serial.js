const SerialPort = require('serialport');
const EventEmitter = require('events').EventEmitter;
const debug = require('debug')('serial:serial');

const connections = new Map();
const emitter = new EventEmitter();

const mapComNameToPath = function(item) {
  const copy = Object.assign({}, item);

  copy.path = copy.comName;
  delete copy.comName;

  return copy;
};

const attachLifecycleListeners = function(instance) {
  instance.on('open', () => {
    emitter.emit('open', { path: instance.path });
  });

  instance.on('close', () => {
    emitter.emit('close', { path: instance.path });
  });

  instance.on('data', data => {
    emitter.emit('receive', { path: instance.path, data: data.toString() });
  });
};

module.exports.list = async function() {
  try {
    const ports = (await SerialPort.list()).map(mapComNameToPath);
    debug(`List: Found ${ports.length}`);
    return ports;
  } catch (error) {
    throw error.message;
  }
};

module.exports.open = async function({ path, baudRate = null }) {
  return new Promise((resolve, reject) => {
    const options = {};

    if (baudRate) {
      options.baudRate = baudRate;
    }

    const openHandler = function(error) {
      if (error) {
        debug(`Error opening port: ${path}, ${error.message}`);
        reject(error.message);
      } else {
        const info = { path, baudRate: this.baudRate };
        attachLifecycleListeners(this);

        connections.set(path, this);
        debug(`Opened port: ${path}`, info);
        resolve(info);
      }
    };

    debug(`Open port: ${path}`);
    new SerialPort(path, options, openHandler);
  });
};

module.exports.onReceive = handler => {
  emitter.on('receive', handler);
};

module.exports.onClose = handler => {
  emitter.on('close', handler);
};

module.exports.onOpen = handler => {
  emitter.on('open', handler);
};

module.exports.close = async function({ path }) {
  return new Promise((resolve, reject) => {
    const connection = connections.get(path);

    if (connection == null) {
      reject('Connection not found');
    }

    if (!connection.isOpen) {
      reject('Connection already closed');
      connections.delete(path);
      return;
    }

    const closeHandler = function(error) {
      if (error) {
        reject(error.message);
      } else {
        connections.delete(path);
        resolve({ path });
      }
    };

    connection.close(closeHandler);
  });
};

module.exports.write = async function({ path, data, encoding = undefined }) {
  return new Promise((resolve, reject) => {
    const connection = connections.get(path);

    if (connection == null) {
      debug(`write: Connection not found for path: ${path}`);
      return reject('Connection not found');
    }

    const doneHandler = function() {
      debug(`write: done at path: ${path}, data: ${data}`);
      resolve({ path, data });
    };

    if (encoding) {
      debug(`writing: data: ${data}, encoding: ${encoding} to path ${path}`);
      connection.write(data, encoding, doneHandler);
    } else {
      debug(`writing: data: ${data} to path ${path}`);
      connection.write(data, doneHandler);
    }
  });
};
