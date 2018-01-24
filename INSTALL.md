# Installation on a Pi

## Hardware

* Raspberry Pi (tested on Zero and Pi 3)
* 8GB SD card
* data USB micro cable (watch out for power only ones!)
* soldered phat dac or USB audio card
* 3.5m jack headphones or mini speaker

## Image an SD card

[Download latest "Raspbian Jessie with Pixel" or "Raspbian Jessie Lite"](https://www.raspberrypi.org/downloads/raspbian/).

Use [Etcher](https://etcher.io/) to easily flash Jessie onto an SD card.

When done but before ejecting

     touch /Volumes/boot/ssh

### If using the Pi Zero

[Follow these instrutions to make it connectable over USB](http://blog.gbaman.info/?p=791). You need to share your wifi over ethernet and "RNDIS / Ethernet Gadget" and connect to your laptop via its micro USB port (not its power port) using the cable.

This will both power the pi zero and allow you to connect to it.

## If using another Pi

Connect an Ethernet cable or set-up wifi. Power as normal via it's power input.

## Steps for all Pis

Run the `deployment/provision` script from the command line.

## Install pHat DAC if using

    curl -sS get.pimoroni.com/phatdac | bash

## USB Microphone

These steps may vary based on your audio set-up. If you use a USB microphone:

1. Plug it in
2. You need to set it as the default audio input so run `arecord -L` to list all the possible capture aliases:

```
pi@raspberrypi:~ $ arecord -L
null
    Discard all samples (playback) or generate zero samples (capture)
default
sysdefault:CARD=Device
    USB PnP Sound Device, USB Audio
    Default Audio Device
front:CARD=Device,DEV=0
    USB PnP Sound Device, USB Audio
    Front speakers
... there are loads ...
iec958:CARD=Device,DEV=0
    USB PnP Sound Device, USB Audio
    IEC958 (S/PDIF) Digital Audio Output
dmix:CARD=Device,DEV=0
    USB PnP Sound Device, USB Audio
    Direct sample mixing device
dsnoop:CARD=Device,DEV=0
    USB PnP Sound Device, USB Audio
    Direct sample snooping device
hw:CARD=Device,DEV=0
    USB PnP Sound Device, USB Audio
    Direct hardware device without any conversions
plughw:CARD=Device,DEV=0
    USB PnP Sound Device, USB Audio
    Hardware device with all software conversions
```

In this instance we'll choose the last one `plughw:CARD=Device,DEV=0`, the "USB PnP Sound Device, USB Audio".

3. Create `/etc/asound.conf` with the following:

```
pcm.!default {
  type asym
  capture.pcm "plughw:CARD=Device,DEV=0"
}
```

This sets the card as the default record device. [More info about this](https://superuser.com/questions/53957/what-do-alsa-devices-like-hw0-0-mean-how-do-i-figure-out-which-to-use#53977).

## Play some audio

Go to http://raspberrypi.local:5000/radio/ and choose a file to play.
