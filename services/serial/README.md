# serial service

The serial service allows serial port connections to be opened and data read and written.

The service listens on a shared WebSocket connection.

## Installation

Requires node.js LTS.

The service can be installed on any system supported by [node-serialport](https://github.com/node-serialport/node-serialport#platform-support).

    npm install --production

## Running

    node src/main

## Debugging

To log out debugging information, set the `DEBUG` environment variable i.e.

    DEBUG=* node src/main

[debug](https://github.com/visionmedia/debug) is used for debugging.

## Usage

To send or receive data from a serial port, it must be opened. Each port on the system is identified by a `path`.

### List

To list the available serial ports on the system:

    {
      topic: 'serial/command/list',
      payload: {}
    }

The `'serial/command/list'` will be emitted containing a list of ports. The `path` attribute is the only on that will definitely be returned. It is used to identify a port.

Example:

    {
      "topic": "serial/event/list",
      "payload": [
        { "path": "/dev/tty.Bluetooth-Incoming-Port" },
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

If there was an error, the error message

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
