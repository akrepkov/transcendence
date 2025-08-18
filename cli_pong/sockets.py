import websockets
import ssl
from websockets.asyncio.client import connect
import json
import logging
import asyncio

logging.basicConfig(level=logging.INFO)

async def connectToServer(token: str):
    uri = "wss://localhost:3000/ws/connect"
    headers = [("Cookie", f"token={token}")]
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    try:
        async with connect(uri, additional_headers=headers, ssl=ssl_context, ping_interval=10, ping_timeout=10) as websocket:
            listen_task = asyncio.create_task(setupSocketEvents(websocket))
            # await setupSocketEvents(websocket)
            input_task = asyncio.create_task(sendMessage(websocket))
            await asyncio.gather(listen_task, input_task)
    except Exception as e:
        print(f"An error occurred while connecting to the server: {e}")


    # try:
    #     websocket = await websockets.connect(uri, additional_headers=headers, ssl=ssl_context, ping_interval=10, ping_timeout=10)
    #     print("Connected to server!")
    #     return websocket
    # except Exception as e:
    #     print(e)
    #     return None

async def setupSocketEvents(websocket):
    try:
        async for message in websocket:
            if message == "ping":
                print("Received ping, sending pong")
                await websocket.pong()

            try:
                data = json.loads(message)
                print(data)
            except json.JSONDecodeError:
                print(f"Received non-JSON message: {message}")
    except websockets.ConnectionClosed as e:
        print(f"Connection closed: {e}")
    except websockets.InvalidState as e:
        print(f"Invalid state: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

async def sendMessage(websocket):
    try:
        while True:
            command = input("Enter a command: ")

            await websocket.send(command)
        # await websocket.send(message)
        # print(f"Sent message: {message}")
    except Exception as e:
        print(f"Failed to send message: {e}")