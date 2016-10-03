const WebSocket = require('faye-websocket');
const EventEmitter = require('events').EventEmitter;

module.exports.create = function(server, router) {
  // const connections = [];

  server.on('upgrade', function(request, socket, body) {
    if (WebSocket.isWebSocket(request)) {
      const ws = new WebSocket(request, socket, body);

      // connections.push(ws);

      const handlePublish = function (evt) {
        ws.send(JSON.stringify(evt));
      };

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

        // Tidy up when connection closes
        router.removeEventListener('pubish', handlePublish);
        ws = null;

        // // remove object from list of connections
        // connections = connections.filter(function(s) {
        //   return ws !== s;
        // });
      });

      // Send messages when the router publishes
      // something
      router.on('publish', handlePublish);
    }
  });
};
