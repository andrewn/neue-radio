Experiment for a new radio prototyping kit for the next radiodan.

~[See here for some context](https://usecanvas.com/andrewn/neue-radio-aka-radiodan-evolution-public/4OwWxY1DB3XiGKEu35KBDF).~ I lost this document :-(

What is this?
-------------

A basic sketch of how things could work if a headless web browser instance was used to playback audio on an embedded linux device like the Raspberry Pi.

### Installation

See [INSTALL.md](INSTALL.md) for detailed instructions.

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

A remote web inspector is available on localhost port 5222 and is accessible from other machines on the network.

Visit http://raspberrypi.local:9222 in a browser on another machine to access the web inspector where all pages are accessible.

NB: Accessing the web inspector directly is currently broken. You need to jump through a few hoops to access it:

1. Visit http://raspberrypi.local:9222 in a browser

### Faster Debug

2. Copy the link named "localhost:5001/manager/" on the page
3. Paste it into [this form](https://jsfiddle.net/pixelblend/s3w3dqsh/)
4. Visit the corresponding URL

### Manual Debug (In case the fiddle disappears)

2. Click the link "localhost:5001/manager/" on the page
3. This link won't load, but copy the Page ID at the end of the URL in the address bar:

    e.g. in the URL `/devtools/page/**41521fab-b30d-41a5-8a47-9557abede207**&remoteFrontend=true`
    the page ID is **`41521fab-b30d-41a5-8a47-9557abede207`**
4. Put the Page ID into the following URL and paste into the Chrome instance runnning on your computer:

    chrome-devtools://devtools/bundled/inspector.html?ws=raspberrypi.local:9222/devtools/page/**PAGE_ID_GOES_HERE**

    For the Page ID above, that would be:

    chrome-devtools://devtools/bundled/inspector.html?ws=raspberrypi.local:9222/devtools/page/**41521fab-b30d-41a5-8a47-9557abede207**

## Physical interface

A very rough implementation for controlling connected lights and buttons exists in `physical`. When run it connects to the peripherals specified in `physical/config/physical-config.json`. The Buttons and RGB LEDs map onto the [Johnny-Five](http://johnny-five.io) API. The Rotary Encoders are provided by the [andrewn/raspi-rotary-encoder](https://github.com/andrewn/raspi-rotary-encoder) package.

The physical server listens for WebSocket connections on port `5100` and emits and receives simple events to all connected clients.

At the moment, the messages are quite low-level. Further work would be to wrap the messages in a simple library that make listing available components and controlling and listening to them a bit easier.

A simple demo page at `http://localhost:5100` allows limited interaction.

## What does it do?

This initial implementation doesn't do very much. [radio/index.html](radio/index.html)  plays a live HLS radio stream using [HLS.js](https://github.com/dailymotion/hls.js) in a webpage.

In a future version it would be good to present a simple remote control that allows you to play/pause the stream.

## Contributors

- [Andrew Nicolaou](https://github.com/andrewn): initial version
- [Libby Miller](https://github.com/libbymiller): added remote control and websockets to connect the public and private radio pages.
