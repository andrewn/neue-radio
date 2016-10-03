Experiment for a new radio prototyping kit for the next radiodan.

[See here for some context](https://usecanvas.com/andrewn/neue-radio-aka-radiodan-evolution-public/4OwWxY1DB3XiGKEu35KBDF).

What is this?
-------------

A basic sketch of how things could work if a headless web browser instance was used to playback audio on an embedded linux device like the Raspberry Pi.

How does it work?
---

### Apps

An app is split into 2 distinct parts: `private` and `public`. The `private` part is a web page that is loaded by a headless browser instance running on the Raspberry Pi and so executes in that context.

Any audio that's played from this `private` webpage will play out the Pi's audio port i.e. the headphone jack, the HDMI port or a connected USB audio card.

The `public` web page can be loaded by a browser on another machine and is used as the remote control for any apps.

The `private` and `public` parts of an app are automatically mounted by their `id` on different ports. So, for an app named `radio`, the `private` part will be mounted at `http://localhost:5001/radio` and the `public` part will be available at `http://localhost:5000/radio`.

On a radiodan system, we proxy port `5000` to port `80` so you load the `radio` app's `public` page at `http://raspberrypi.local/radio`.

#### Mounting

In this demo implementation, the app is contained in the `radio` directory. Any files in `radio/public` are available on http://raspberrypi.local/radio so it's best to have a page called `radio/public/index.html` containing the entry point to the remote control. The file `radio/index.html` is the page loaded by the headless web browser. Any files in `radio/` will be accessible by the `private` web page.

#### Communication between private and public

Because it's just 2 web pages, the idea is that browser APIs must be used to communicate between the two pages such as [window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

### Manager

The manager is responsible for starting and stopping all radio apps. It's a webpage that's the first page loaded on the internal chromium browser instance. It mounts the `private` part of each app in an iframe.

### Debugging

A remote web inspector is available on localhost port 5222. This isn't accessible from other machines on the network. You can use ssh on the Pi to make this available externally.

In another session on the Pi run the following command:

    ssh -L 0.0.0.0:9223:localhost:9222 localhost -N

Visit http://raspberrypi.local:9223 on another machine to access the web inspector where all pages are accessible.

## Physical interface

A very rough implementation for controlling connected lights and buttons exists in `physical`. When run it connects to the peripherals specified in `physical/config/physical-config.json`. The Buttons and RGB LEDs map onto the [Johnny-Five](http://johnny-five.io) API. The Rotary Encoders are provided by the [andrewn/rotary-encoder](https://github.com/andrewn/raspi-rotary-encoder) package.

The physical server listens for WebSocket connections on port `5100` and emits and receives simple events to all connected clients.

At the moment, the messages are quite low-level. Further work would be to wrap the messages in a simple library that make listing available components and controlling and listening to them a bit easier.

A simple demo page at `http://localhost:5100` allows limited interaction.

## What does it do?

This initial implementation doesn't do very much. [radio/index.html](radio/index.html)  plays a live HLS radio stream using [HLS.js](https://github.com/dailymotion/hls.js) in a webpage.

In a future version it would be good to present a simple remote control that allows you to play/pause the stream.

## Installation on a Pi

Install chromium and xvfb:

    sudo apt-get update
    sudo apt-get install rpi-chromium-mods xvfb

Install the manager and example app:

    mkdir /opt/radiodan
    git clone https://github.com/andrewn/neue-radio rde
    cd rde/manager
    npm install --production
    cd ..

Install the physical interface manager:

    cd physical
    JOBS=MAX npm install --production # use all cores
    cd ..

Install scripts to manage processes:

    sudo cp systemd/* /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl start manager

You should hear some radio playing out of the default speakers!

Run on boot:

    sudo systemctl enable manager
    sudo systemctl enable manager-web-server
    sudo systemctl enable physical
