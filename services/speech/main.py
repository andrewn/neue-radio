#!/usr/bin/env python3
import asyncio
import json
import os
import signal
import socket
import sys

from soapbox.connection import connect_and_handle_messages
from soapbox.handler import MessageHandler

WS_HOST = os.getenv('WS_HOST', socket.gethostbyname(socket.gethostname()))
WS_PORT = os.getenv('WS_PORT', None)
DEBUG = os.getenv('DEBUG', False)

if WS_PORT == None:
    print("WS_PORT must be supplied as environment variable")
    sys.exit(1)

loop = asyncio.get_event_loop()

if DEBUG:
    import logging
    logging.getLogger('asyncio').setLevel(logging.DEBUG)
    loop.set_debug(True)

# The term_signal future is completed when receiving SIGTERM or SIGINT
term_signal = asyncio.Future()
loop.add_signal_handler(signal.SIGTERM, term_signal.set_result, None)
loop.add_signal_handler(signal.SIGINT, term_signal.set_result, None)


async def main():
    try:
        handler = MessageHandler()

        connection = asyncio.ensure_future(
            connect_and_handle_messages(
                WS_HOST, WS_PORT, handler.handle_message)
        )

        # Wait for either the `connection` or `term_signal` future to complete
        # connection completing means that the WS connection has been closed
        # term_signal completing means an OS signal has been received
        await asyncio.wait((connection, term_signal), return_when=asyncio.FIRST_COMPLETED)

    finally:
        print("clean up")
        handler.close()
        connection.cancel()


loop.run_until_complete(main())
