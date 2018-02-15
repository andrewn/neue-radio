# Speech Dispatcher Service

A tiny service that can speak under WebSocket control. This communicates using a [`speech-dispatcher`](https://devel.freebsoft.org/doc/speechd/speech-dispatcher.html) instance using their own [Python API bindings](https://devel.freebsoft.org/doc/speechd/speech-dispatcher.html#Python-API).

## Installation

Requires `python3.5+`:

On Debian-based systems:

    sudo apt-get install speech-dispatcher python3-speechd python3-websockets

## Running

    WS_HOST=raspberrypi.local WS_PORT=8000 python3 main.py

`WS_PORT` is mandatory. The host IP is used if `WS_HOST` is not supplied.

## Protocol

| topic                | payload                        |
| -------------------- | ------------------------------ |
| speech.command.speak | { utterance: 'Hello, world!' } |
| speech.event.spoken  | { utterance: 'Hello, world!' } |
