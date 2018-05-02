# Serial Service

Summary: The serial service allows serial port connections to be opened and data read and written.

The service listens on a shared WebSocket connection.

## Usage

To send or receive data from a serial port, it must be opened. Each port on the system is identified by a `path`.

### List

To list the available serial ports on the system:

    {
      topic: "serial/command/list",
      payload: {}
    }

`serial/event/list` will be emitted containing a list of ports. The `path` attribute is the only on that will definitely be returned and it is used to identify a port.

Example:

    {
      "topic": "serial/event/list",
      "payload": [
        {
          "path": "/dev/tty.Bluetooth-Incoming-Port"
        },
        {
          "locationId": "14100000",
          "vendorId": "1a86",
          "productId": "7523",
          "path": "/dev/tty.wchusbserial1410"
        }
      ]
    }

See [node-serialport `list` API docs for more info about what can be returned](https://node-serialport.github.io/node-serialport/SerialPort.html#.list). Note `comName` is aliased to `path`.

### Open a port

    {
      topic: "serial/command/open",
      payload: { path: "/dev/tty.wchusbserial1410", baudRate: 115200 }
    }

`baudRate` is optional.

`serial/event/open` will be emitted containing the opened path and the baudRate the port is using.

If there was an error, the error message is returned.

Example of success:

    {
      topic: "serial/event/open",
      payload: { path: "/dev/tty.wchusbserial1410", baudRate: 115200 }
    }

Example of error:

    {
      topic: "serial/event/open",
      payload: { error: "Error: No such file or directory, cannot open /dev/tty.wchusbserial141" }
    }

To change the `baudRate` you must close the port and reopen it with a new one.

### Close a port

    {
      topic: "serial/command/close",
      payload: { path: "/dev/tty.wchusbserial1410" }
    }

`serial/event/close` will be emitted containing the closed port. If an error occurred the payload will contain the message in an "error" property.

Example:

    {
      topic: "serial/command/close",
      payload: { path: "/dev/tty.wchusbserial1410" }
    }

### Send data

After opening a port, you can send data to it:

    {
      topic: "serial/command/send",
      payload: {
        path: "/dev/tty.wchusbserial1410",
        data: "ROBOT, I COMMAND THEE\n\r",
        encoding: "utf-8",
      }
    }

`encoding` is optional but any of [node's](https://node-serialport.github.io/node-serialport/SerialPort.html#write) encodings can be specified.

The `serial/event/send` event will be emitted containing the sent data or an error.

### Receive data

Any data received on an open port will be emitted via the `serial/event/receive` topic.

    {
      topic: "serial/event/receive",
      payload: {
        path: "/dev/tty.wchusbserial1410",
        data: "Sensor:10",
      }
    }

## Example

1.  Open a page that has access to the WebSocket client e.g. `http://raspberrypi.local/radio`

2.  Open the Web Inspector

3.  Log any serial WebSocket events to the console

```js
ws.subscribe(new RegExp('serial/event/.*'), console.log);
```

2.  List available ports (make sure your device is plugged in)

```js
ws.publish({ topic: 'serial/command/list' });
```

You should see a response in a `list` event containing some info ahout available ports

```
serial/event/list
{ path: "/dev/ttyAMA0" }
{ manufacturer: "1a86", pnpId: "usb-1a86_USB2.0-Serial-if00-port0", vendorId: "1a86", productId: "7523", path: "/dev/ttyUSB0" }
```

3.  Open the serial port:

```js
ws.publish({
  topic: 'serial/command/open',
  payload: { path: '/dev/ttyUSB0', baudRate: 115200 }
});
```

An event is returned with the port that was opened or an error:

```js
serial/command/open
{ path: "/dev/ttyUSB0", baudRate: 115200 }
```

4.  Receive data

Events will be raised with the info recieved:

```
serial/event/receive
{ path: "/dev/ttyUSB0", data: "↵Cache-Control: no-cache↵Str" }
```

5.  Send data

```js
ws.publish({
  topic: 'serial/command/send',
  payload: { path: '/dev/ttyUSB0', data: 'HELO' }
});
```

The `send` event indicates that it has been sent:

```
serial/event/send
{ path: "/dev/ttyUSB0", data: "HELO" }
```

6.  Close the port

When done, you should close the port.

```js
ws.publish({
  topic: 'serial/command/close',
  payload: { path: '/dev/ttyUSB0' }
});
```

The `close` event will be emitted:

```
serial/command/close
{ path: "/dev/ttyUSB0" }
```

This event is also emitted if the port is closed for any other reason.

## Installation

Requires node.js LTS.

The service can be installed on any system supported by [node-serialport](https://github.com/node-serialport/node-serialport#platform-support).

    npm install --production

## Running

    npm start

## Debugging

To log out debugging information, set the `DEBUG` environment variable i.e.

    DEBUG=* npm start

[debug](https://github.com/visionmedia/debug) is used for debugging.
