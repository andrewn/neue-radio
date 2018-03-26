# Websocket Library

This Isomorphic JS library allows for standardised communication between all
parts of the Neue Architecture. It supports multiple topic subscription and
reconnected automatically on disconnect.

## Setup

### Apps

Add this to your `index.html`:

```javascript
<script src="/websocket"></script>
```

The `createWebsocket` function is available globally.

### Services

Add this to your `package.json`:

```json
"dependencies": {
  "websocket": "../../shared/websocket"
}
```

The `createWebsocket` function is available as:

```javascript
const createWebsocket = require('websocket');
```

## Usage

### Instantiation

To create a new websocket instance:

```javascript
const ws = createWebsocket();
```

By default the WebSocket will connect to the server as created by the Manager
Service. You can specify an alternative URL:

```javascript
const ws = createWebsocket({ url: 'ws://example.com:8080' );
```

More debugging information is available, too:

```javascript
const ws = createWebsocket({ debug: true });
```

### Ready

A promise that emits when the WebSocket is connected to the server:

```javascript
ws.ready.then(() => console.log('Ready to go!'));
```

### Publish

Please see the [WebSocket Documentation](../../docs/WEBSOCKET.md) for
specification standards for publishing topics and data.

```javascript
ws.publish({
  topic: 'downloader/event/available',
  payload: { url: 'file.webm' }
});
```

#### Subscribe

#### Subscription to a single topic
```javascript
ws.subscribe('downloader/event/available', ({ topic, payload }) => {
  // do something with payload object
});
```

#### Subscription to multiple topics

```javascript
ws.subscribe(new RegExp('downloader/event/.*'), ({ topic, payload }) => {
  // will run for every topic of type downloader/event
});
```

#### Unsubscribe

UnSubscriptions are all-or-nothing: if you have a wildcard subscription, you can
only unsubscribe from the entire wildcard.

```javascript
ws.unsubscribe('downloader/event/available');
```
