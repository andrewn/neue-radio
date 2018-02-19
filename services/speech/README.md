# Speech Dispatcher Service

A tiny service that can speak under WebSocket control. This communicates using a [`speech-dispatcher`](https://devel.freebsoft.org/doc/speechd/speech-dispatcher.html) instance using the SSIP protocol.

## Installation

Requires node.js 8+

On Debian-based systems:

    sudo apt-get install speech-dispatcher

Then:

    npm install --production

## Running

    WS_HOST=raspberrypi.local WS_PORT=8000 node src/main

`WS_PORT` is mandatory. The host IP is used if `WS_HOST` is not supplied.

## Debugging

To log out debugging information, set the `DEBUG` environment variable i.e.

    WS_PORT=8000 DEBUG=* node src/main

[debug](https://github.com/visionmedia/debug) is used for debugging.

## Protocol

| topic                      | payload                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| speech.command.speak       | { utterance: 'Hello, world!' } <br /> Optionally, voiceType: 'ID' can change the voice |
| speech.event.spoken        | { utterance: 'Hello, world!' }                                                         |
| speech.command.list-voices | { voices: ['MALE1', 'FEMALE1'] }                                                       |
