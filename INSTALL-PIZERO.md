# Pi Zero instructions for Radiodan Neue

Andrew's instructions are here and mostly hold - I've made some tweaks.

## Hardware

* pi zero
* 8GB SD card 
* data USB micro cable (watch out for power only ones!)
* soldered phat dac
* 3.5m jack headphones

## Image an SD card

    diskutil list
    diskutil unmountDisk /dev/diskN
    sudo dd bs=1m if=~/Downloads/2016-09-23-raspbian-jessie.img of=/dev/rdiskN
    
Note that if you use the latest, you need to tweak it for ssh access:

     tar xzvf 2016-11-25-raspbian-jessie.zip

(unzip gave an error)

     diskutil list
     diskutil unmountDisk /dev/diskN
     sudo dd bs=1m if=~/Downloads/2016-11-25-raspbian-jessie.img of=/dev/rdiskN

when done but before ejecting

     touch /Volumes/boot/ssh

(see https://www.raspberrypi.org/blog/a-security-update-for-raspbian-pixel/)

## change to make zero an appliance 

See http://blog.gbaman.info/?p=791 (do this while the card is still in your main machine).

## Connect to the pi

On your laptop, share your wifi over ethernet and "RNDIS / Ethernet Gadget"
Put the card in the pi and connect to your laptop via its micro USB port (not its power port) using the cable. 
This will both power the pi zero and allow you to connect to it.

ssh into the pi
    
    ssh pi@raspberry.local

then

    sudo raspi-config
    expand file system

## Install Radiodan Neue 

(original is at https://github.com/andrewn/neue-radio)

Prerequisites:

    sudo apt-get update
    sudo apt-get install rpi-chromium-mods xvfb

Radiodan:

    sudo mkdir /opt/radiodan
    cd /opt/radiodan
    sudo chown -R pi:pi .
    git clone https://github.com/libbymiller/neue-radio rde
    cd rde/manager

## install node 

e.g. via radiodan provisioning if you're using it (https://github.com/radiodan/provision) or https://blog.wia.io/installing-node-js-v4-0-0-on-a-raspberry-pi

then

    npm install --production
    cd ..

    sudo cp systemd/* /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl start manager

install phatdac

    curl -sS get.pimoroni.com/phatdac | bash

reboot

## plug in speaker / headphones and test

go to http://raspberrypi.local:5000/radio/ and choose a file to play


