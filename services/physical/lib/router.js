const EventEmitter = require('events').EventEmitter;
const util = require('util');

const SEP = '/';

const Router = function() {
  this.types = {};
};

util.inherits(Router, EventEmitter);

Router.prototype.register = function(type, id) {
  const self = this;

  if (this.types[type] == null) {
    this.types[type] = {};
  }

  if (this.types[type][id]) {
    throw new Error(type + ' with ID ' + id + ' has already been registered');
  }

  const routable = new EventEmitter();
  routable.publish = function(topic, payload) {
    const path = type + SEP + id + SEP + topic;
    self.emit('publish', { topic: path, payload });
  };

  console.log('Router#register: ', type + SEP + id);

  this.types[type][id] = routable;

  return routable;
};

// Takes a routing key of `<type>.<id>.<event>`
// and fires the correct event on the routable
Router.prototype.route = function(path, data) {
  const parts = path.split(SEP);
  const type = parts[0];
  const id = parts[1];
  const event = parts[2];

  if (this.types[type] && this.types[type][id] && event) {
    this.types[type][id].emit(event, data);
  } else {
    console.warn('Could not route: ', path);
  }
};

// Returns the currently registered types
Router.prototype.registered = function() {
  const registered = {};

  Object.keys(this.types).forEach(
    function(type) {
      registered[type] = Object.keys(this.types[type]);
    }.bind(this)
  );

  return registered;
};

module.exports = Router;
