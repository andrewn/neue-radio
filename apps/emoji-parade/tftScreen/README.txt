# Raspian

Install full raspian - with desktop

# Install tft screen stuff

Enable spi / 12c

    curl -O https://www.waveshare.com/w/upload/3/34/LCD-show-180331.tar.gz

    tar -zxvf LCD-show-180331.tar.gz
    cd LCD-show/
    chmod +x LCD35-show
    ./LCD35-show

- reboots by itself, screen should work

(from https://www.waveshare.com/wiki/3.5inch_RPi_LCD_(A) )

# install 

     git clone https://github.com/andrewn/neue-radio.git

add emoji-parade

     sudo apt-get install unclutter

     git clone https://github.com/andrewn/neue-radio.git

add emoji-parade, tftScreen branch

     sudo apt-get install unclutter

install emoji-parade

then

     cp /opt/radiodan/rde/apps/emoji-parade/tftscreen/autostart /home/pi/.config/lxsession/LXDE-pi/autostart
     cp /opt/radiodan/rde/apps/emoji-parade/tftscreen/start-web-environment.sh /opt/radiodan/rde/services/manager/start-web-environment.sh


     sudo systemctl disable manager
     sudo systemctl daemon-reload

reboot


