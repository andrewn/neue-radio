#!/bin/bash

REMOTE_DEBUGGING_ADDRESS=0.0.0.0
APP_URL=http://localhost:${EXTERNAL_PORT}/emoji-parade/screen.html
ARGS="--kiosk --disable-infobars --disable-session-crashed-bubble --no-first-run --autoplay-policy=no-user-gesture-required --remote-debugging-port=${REMOTE_DEBUGGING_PORT} --remote-debugging-address=${REMOTE_DEBUGGING_ADDRESS}"

MACOS_CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

if command -v chromium-browser; then
  sleep 5
  rm -rf /home/pi/.config/chromium/
  # this is for bad crashes, which leave a lock handing round
  rm /home/pi/.config/chromium/SingletonLock
  # no longer headless
  chromium-browser $ARGS $APP_URL
elif [ -f "$MACOS_CHROME" ]; then
  "$MACOS_CHROME" --user-data-dir=/tmp $ARGS
else
  echo "No chrome"
  exit 1
fi

