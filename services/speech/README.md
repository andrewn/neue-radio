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

## Protocol

| topic                | payload                        |
| -------------------- | ------------------------------ |
| speech.command.speak | { utterance: 'Hello, world!' } |
| speech.event.spoken  | { utterance: 'Hello, world!' } |
