# Configuring audio on the Pi

Summary: Linux audio configuration can be very challenging. This guide contains instructions for configuring a variety of audio hardware. **The default 3.5mm jack DOES NOT WORK with this system - you just get white noise.**

The base system uses Pulse Audio in System mode. This forces a single instance of the Pulse Audio server to run and all applications connect to it.

This document assumes that you have Pulse Audio running in system mode.

## Pimoroni pHat DAC

`sudo nano /boot/config.txt`

Disable on-board audio by commenting out `dtparam=audio=on`:

`#dtparam=audio=on`

Add `dtoverlay=hifiberry-dac`:

```
#dtparam=audio=on
dtoverlay=hifiberry-dac
```

## ReSpeaker 2-Mics pHAT

http://wiki.seeed.cc/ReSpeaker_2_Mics_Pi_HAT/

```
git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard
sudo ./install.sh 2mic
```

`sudo nano /boot/config.txt`

Disable on-board audio by commenting out `dtparam=audio=on` and adding `dtoverlay=seeed-2mic-voicecard` so it looks like this:

sudo systemctl disable seeed-voicecard.service
sudo mv /etc/asound.conf /etc/asound.conf.disabled

Reboot

Test output:

`speaker-test -D plughw:0,0 -t wav`

## ReSpeaker 4-Mic Array for Raspberry Pi

http://wiki.seeed.cc/ReSpeaker_4_Mic_Array_for_Raspberry_Pi/

Save file (Ctl-X Y)

```
git clone https://github.com/respeaker/seeed-voicecard.git
cd seeed-voicecard
sudo ./install.sh 4mic
```

`sudo nano /boot/config.txt`

Disable on-board audio by commenting out `dtparam=audio=on` and adding `dtoverlay=seeed-4mic-voicecard` so it looks like this:

```
#dtparam=audio=on
dtoverlay=seeed-4mic-voicecard
```

sudo systemctl disable seeed-voicecard.service
sudo mv /etc/asound.conf /etc/asound.conf.disabled

## Adafruit I2S 3W Class D Amplifier Breakout - MAX98357A

https://www.adafruit.com/product/3006

`sudo nano /boot/config.txt`

Disable on-board audio by commenting out `dtparam=audio=on`:

`#dtparam=audio=on`

Add `dtoverlay=hifiberry-dac`:

```
#dtparam=audio=on
dtoverlay=hifiberry-dac
```

Wiring:

| Amp   | Pi                                             |
| ----- | ---------------------------------------------- |
| Vin   | [5V](https://pinout.xyz/pinout/pin2_5v_power#) |
| GND   | [GND](https://pinout.xyz/pinout/ground#)       |
| DIN   | [#21](https://pinout.xyz/pinout/pin40_gpio21#) |
| BCLK  | [#18](https://pinout.xyz/pinout/pin12_gpio18#) |
| LRCLK | [#19](https://pinout.xyz/pinout/pin35_gpio19#) |

## pHAT BEAT

https://shop.pimoroni.com/products/phat-beat

`sudo nano /boot/config.txt`

Disable on-board audio by commenting out `dtparam=audio=on`:

`#dtparam=audio=on`

Add `dtoverlay=hifiberry-dac` and `dtoverlay=i2s-mmap`:

```
#dtparam=audio=on
dtoverlay=hifiberry-dac
dtoverlay=i2s-mmap
```
