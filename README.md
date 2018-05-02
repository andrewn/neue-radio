# Radiodan Neue

## What is this?

A reimagining of the [Radiodan Architecture](http://radiodan.net), focusing on
web standards and ease of prototyping across programming environments.

## Installation

See [INSTALL.md](docs/INSTALL.md) for detailed instructions.

## Debugging

Because these internal apps are run internally on the Pi, it can be difficult to
debug. To enable this, a remote Web Inspector is available and is accessible from other machines on the network. This allows you to use the full [Chrome
DevTools](https://developers.google.com/web/tools/chrome-devtools/) to inspect
what's running on the device.

In order to aid this process, a remote web inspector is available on
http://raspberrypi.local:9222 and is accessible from other machines on the
network.

There are some complications when it comes to accessing the DevTools remotely.
We have found two methods of getting started:

1.  Visit http://raspberrypi.local:5004 where a list of all available pages will
    be waiting.
2.  Copy/paste the given link into Chrome on your computer to launch the
    inspector.

## Architecture

This Architecture comprises of several moving parts. Most of these - as
potential developer - you will not have to worry about or update. Having said
that, it's useful to have an understanding of what they do and how they
interact.

### Apps

Apps are the most visible section of the architecture - if you're developing
new radio ideas, they'll be in form of apps.

An app takes the form of two single-page web apps that communicate over
WebSockets. These two parts are named `internal` and `external`. The `internal`
page is loaded by a headless instance of Chromium running on the Raspberry Pi.

Any audio that's played from this `internal` web page will play out the Pi's
audio port i.e. the headphone jack, the HDMI port or a connected USB audio
card.

The `external` web page can be loaded by a browser on another machine and is
used as the User Interface or Remote Control for the app.

The `internal` and `external` parts of an app are automatically mounted by
their `id` on different ports. So, for an app named `radio`, the `internal`
part will be mounted at `http://localhost:5001/radio` and the `external` part
will be available at `http://localhost:5000/radio`. All radiodan apps must have
an `index.html` file in each part so that they can be loaded on mount.

On a radiodan system, we proxy port `5000` to port `80` so you load the `radio`
app's `external` page at `http://raspberrypi.local/radio`.

A list of available apps are [available below](#available-apps).

### Manager Service

This service takes care of mounting and running your apps, as well as running
the WebSockets server and client that they communicate over. By default, all
available apps are mounted. You can limit which apps run by using the [setup
service][#setup-service].

The `internal` section of the application has a special `index.html` page that
loads the `internal` part of each app into an IFrame.

### Manager-Web

Once all apps are mounted by the Manager, this process loads the web page
available on the `internal` port into a headless version of Chromium.

## Available Apps

### Radio

This initial implementation doesn't do very much.
[radio/index.html](radio/index.html) plays a live HLS radio stream using
[HLS.js](https://github.com/dailymotion/hls.js) in a web page.

In a future version it would be good to present a simple remote control that
allows you to play/pause the stream.

### YouTube

Plays and controls a YouTube video, using either [YouTube's IFrame
API](https://developers.google.com/youtube/iframe_api_reference), or the
[Downloader Service](#downloader-service) for offline support.

## Available Services

### Setup Service

A web service, available at `http://localhost:5020`, allows configuration of
which apps and services run when your Pi is started. Some essential services -
such as [Manager](#manager-service), [Debug](#debug-service), and the Setup
Service itself - cannot be removed.

### Physical Interface Service

A very rough implementation for controlling connected lights and buttons exists
in `physical`. When run it connects to the peripherals specified in
`physical/config/physical-config.json`.

Supported components:

* Buttons, RGB LEDs, LED Matrices ([Johnny-Five](http://johnny-five.io))
* Rotary Encoders ([andrewn/raspi-rotary-encoder](https://github.com/andrewn/raspi-rotary-encoder))
* Capacitive touch sensor (CAP1188) ([andrewn/raspi-cap](https://github.com/andrewn/raspi-cap))

### Downloader Service

Uses the `youtube-dl` binary to produce audio files in
[WebM](https://www.webmproject.org/) format for consumption by apps.

There is a basic http interface available on http://localhost:5002.

### RFID Service

Listens for a connected MFC522 card reader and publishes found cards across the
WebSocket server.

There is a basic http interface available on http://localhost:5003.

## Contributors

* [Andrew Nicolaou](https://github.com/andrewn)
* [Libby Miller](https://github.com/libbymiller)
* [Dan Nuttall](https://github.com/pixelblend)
