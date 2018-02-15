import asyncio
import websockets

from soapbox.message import Message


def connect(host, port):
    return websockets.connect('ws://' + host + ':' + port)


async def connect_and_handle_messages(host, port, handler):
    websocket = await connect(host, port)
    print("connected")
    while True:
        try:
            data = await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
            print("connection has closed")
            raise

        message = None
        response = None

        try:
            message = Message.from_json(data)
        except:
            print("invalid message")

        if message != None:
            try:
                response = handler(message)
            except:
                print("error handling message")

        if response != None:
            try:
                await websocket.send(response.to_json())
            except:
                print("error sending response")
                pass
