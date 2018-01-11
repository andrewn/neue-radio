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

## Play some audio

Go to http://raspberrypi.local:5000/radio/ and choose a file to play.
