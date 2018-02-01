#!/bin/bash

REMOTE_DEBUGGING_ADDRESS=0.0.0.0
APP_URL=http://localhost:${INTERNAL_PORT}/
ARGS="--disable-gpu --use-fake-ui-for-media-stream --remote-debugging-port=${REMOTE_DEBUGGING_PORT} --remote-debugging-address=${REMOTE_DEBUGGING_ADDRESS} $APP_URL"

MACOS_CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

if command -v chromium-browser; then
  sleep 5
  chromium-browser --headless $ARGS
elif [ -f "$MACOS_CHROME" ]; then
  "$MACOS_CHROME" $ARGS
else
  echo "No chrome"
  exit 1
fi
