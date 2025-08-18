#!/bin/python3

from auth import loginUser
from sockets import *
import asyncio

async def main():
    token, username = loginUser()
    if not token:
        print("Login failed. Exiting.")
        return

    websocket = await connectToServer(token)
    # if not websocket:
    #     print("Failed to connect to WebSocket server. Exiting.")
    #     return
    #
    # listen_task = asyncio.create_task(setupSocketEvents(websocket))
    #
    # try:
    #     while True:
    #         command = input("Enter a command: ")
    #         await sendMessage(websocket, command)
    #
    #         print(command)
    # except KeyboardInterrupt:
    #     print("Exiting...")
    # finally:
    #     listen_task.cancel()
    #     # need to wait for the listen task to finish before closing the websocket
    #     try:
    #         await listen_task
    #     except asyncio.CancelledError:
    #         pass
    #     await websocket.close()
    #     print("WebSocket connection closed.")


if __name__ == "__main__":
    asyncio.run(main())
