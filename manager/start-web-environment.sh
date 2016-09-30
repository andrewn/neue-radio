#!/bin/bash

INTERNAL_PORT=5001
REMOTE_DEBUGGING_PORT=9222

/usr/bin/xvfb-run chromium-browser --remote-debugging-port=$REMOTE_DEBUGGING_PORT --app=http://localhost:$INTERNAL_PORT/radio
