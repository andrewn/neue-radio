# Installation

Summary: Installating this system on a desktop or Raspberry Pi.

## Installation on a computer

Tested on macOS 10.13.

You'll need a recent Long Term Support (LTS) release of [node.js](https://nodejs.org/en/). Newer versions are likely to work but have not been tested. v8.9.4 and above should work.

Clone this repo:

    git clone https://github.com/andrewn/neue-radio

Install dependencies:

    cd neue-radio
    npm install

Install dependencies for all apps and services:

    npm run install-all

Run **all** apps and services:

    npm start

To run a specific app only:

    APP_PATH=~/path/to/app/dir npm start

This will open a new instance of Chrome containing the Manager page. Leave this page open, and open new windows to run the external pages of the apps.

## Installation on a Pi

### Hardware

* Raspberry Pi (tested on Zero and Pi 3)
* 8GB SD card
* data USB micro cable (watch out for power only ones!)
* soldered phat dac or USB audio card
* 3.5m jack headphones or mini speaker

### Image an SD card

[Download latest "Raspbian Stretch with Pixel" or "Raspbian Stretch Lite"](https://www.raspberrypi.org/downloads/raspbian/). We'd recommend "Raspbian Stretch Lite" as it's smaller.

Use [Etcher](https://etcher.io/) to easily flash Raspbian onto an SD card.

When done but before ejecting:

    touch /Volumes/boot/ssh

Final step to enable wifi by setting a country and adding a network name:

    nano /Volumes/boot/wpa_supplicant.conf

contents:

    country=GB
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
    ssid="AP_NAME"
    psk="AP_PASSWORD"
    key_mgmt=WPA-PSK
    }

### If using the Pi Zero

[Follow these instructions to make it connectable over USB](http://blog.gbaman.info/?p=791). You need to share your wifi over ethernet and "RNDIS / Ethernet Gadget" and connect to your laptop via its micro USB port (not its power port) using the cable.

This will both power the pi zero and allow you to connect to it.

### If using another Pi

Connect an Ethernet cable or set-up wifi. Power as normal via its power input.

### Steps for all Pis

Run the provisioning script which will install all required dependencies and code.

    curl https://raw.githubusercontent.com/andrewn/neue-radio/master/deployment/provision | sudo bash

Then reboot.

## Configure audio

Read the [audio guide](AUDIO.md) to set-up the audio hardware.

### Play some audio

Go to http://raspberrypi.local:5000/radio/ and choose a file to play.
