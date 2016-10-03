const WebSocket = require('faye-websocket');
const EventEmitter = require('events').EventEmitter;

module.exports.create = function(server, router) {
  // const connections = [];

  server.on('upgrade', function(request, socket, body) {
    if (WebSocket.isWebSocket(request)) {
      var ws = new WebSocket(request, socket, body);
      // var updateHandler = emitStateChange.bind(null, ws);

      // connections.push(ws);

      // send complete state on new connection
      // ws.send(JSON.stringify({
      //   type: 'state',
      //   data: state.get()
      // }));

      // On connection, send the currently registered
      // devices
      ws.send(JSON.stringify({
        type: 'registered',
        data: router.registered()
      }));

      // We expect incoming messages to have the shape:
      // {
      //    key: '<type>.<id>',
      //    data:  <any serializable data object>
      // }
      ws.on('message', function(evt) {
        console.log('WS#message', evt.data);
        const payload = JSON.parse(evt.data);
        router.route(payload.key, payload.data);
      });

      ws.on('close', function(event) {
        console.log('close', event.code, event.reason);
        // state.off('update', updateHandler);
        ws = null;

      // // remove object from list of connections
      // connections = connections.filter(function(s) {
      //   return ws !== s;
      // });
      });

      router.on('publish', function (evt) {
        console.log('public', evt.topic, evt.data);
      });

      // send updates when state changes
      // state.on('update', updateHandler);
    }
  });

  const instance = new EventEmitter();
  instance.publish = function (msg) {
    console.log('Publish ', msg);
  };

  return instance;
}

function emitStateChange(ws, e) {
  var eventData = e.data;
  ws.send(JSON.stringify({
    type: 'update',
    data: eventData
  }));
}
