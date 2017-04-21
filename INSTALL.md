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

Install chromium and xvfb:

    sudo apt-get update
    sudo apt-get install rpi-chromium-mods xvfb

## Install node


Use [radiodan provisioning](https://github.com/radiodan/provision) to install node and also to make everything on port 80 forward to port 5000. 

Once you've followed the setup instructions there:

    sudo ./provision node iptables

## Install pHat DAC if using

    curl -sS get.pimoroni.com/phatdac | bash

## Install code

Install the manager and example app:

    mkdir /opt/radiodan
    cd /opt/radiodan 
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

Run on boot:

    sudo systemctl enable manager
    sudo systemctl enable manager-web-server
    sudo systemctl enable physical

## Play some audio

Go to http://raspberrypi.local:5000/radio/ and choose a file to play.
