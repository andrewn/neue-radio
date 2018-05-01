# Installation on a computer

Tested on macOS 10.13.

Clone this repo:

    git clone https://github.com/andrewn/neue-radio

Install dependencies:

    cd neue-radio
    npm install

Install dependencies for all apps and services:

    npm run install-all

Run services:

    npm start

# Installation on a Pi

## Hardware

* Raspberry Pi (tested on Zero and Pi 3)
* 8GB SD card
* data USB micro cable (watch out for power only ones!)
* soldered phat dac or USB audio card
* 3.5m jack headphones or mini speaker

## Image an SD card

[Download latest "Raspbian Stretch with Pixel" or "Raspbian Stretch Lite"](https://www.raspberrypi.org/downloads/raspbian/).

Use [Etcher](https://etcher.io/) to easily flash Jessie onto an SD card.

When done but before ejecting

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

[Follow these instrutions to make it connectable over USB](http://blog.gbaman.info/?p=791). You need to share your wifi over ethernet and "RNDIS / Ethernet Gadget" and connect to your laptop via its micro USB port (not its power port) using the cable.

This will both power the pi zero and allow you to connect to it.

## If using another Pi

Connect an Ethernet cable or set-up wifi. Power as normal via it's power input.

## Steps for all Pis

    curl https://raw.githubusercontent.com/andrewn/neue-radio/master/deployment/provision | sudo bash

## Install pHat DAC if using

    curl -sS get.pimoroni.com/phatdac | bash

## Play some audio

Go to http://raspberrypi.local:5000/radio/ and choose a file to play.
