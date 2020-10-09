#!/bin/bash

REMOTE_DEBUGGING_ADDRESS=0.0.0.0
APP_URL=http://localhost:${INTERNAL_PORT}/
ARGS="--disable-gpu --use-fake-ui-for-media-stream --autoplay-policy=no-user-gesture-required --remote-debugging-port=${REMOTE_DEBUGGING_PORT} --remote-debugging-address=${REMOTE_DEBUGGING_ADDRESS} $APP_URL"

MACOS_CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

TRIES=30
WAIT=10

if command -v chromium-browser; then
  while /bin/netstat -an | /bin/grep \:5000 | /bin/grep LISTEN ; [ $? -ne 0 ]; do
    let TRIES-=1
    if [ $TRIES -gt 1 ]; then
            sleep $WAIT
    fi
  done
  chromium-browser --headless $ARGS
elif [ -f "$MACOS_CHROME" ]; then
  "$MACOS_CHROME" --user-data-dir=/tmp $ARGS
else
  echo "No chrome"
  exit 1
fi
