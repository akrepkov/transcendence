import websockets
import ssl
from websockets.asyncio.client import connect
import json
import logging
import asyncio
from pong import draw_pong_game

logging.basicConfig(level=logging.INFO)

async def cleanup(listen_task, input_task, websocket):
    listen_task.cancel()
    input_task.cancel()
    try:
        await listen_task
    except asyncio.CancelledError:
        pass

    try:
        await input_task
    except asyncio.CancelledError:
        pass

    if not websocket.state == websockets.protocol.State.CLOSED:
        await websocket.close()

async def connectToServer(token: str):
    uri = "wss://localhost:3000/ws/connect"
    headers = [("Cookie", f"token={token}")]
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    try:
        async with connect(uri, additional_headers=headers, ssl=ssl_context) as websocket:
            listen_task = asyncio.create_task(setupSocketEvents(websocket))
            input_task = asyncio.create_task(handleUserInput(websocket))
            try:
                await asyncio.gather(listen_task, input_task)
            except asyncio.CancelledError:
                pass
            finally:
                await cleanup(listen_task, input_task, websocket)
    except Exception as e:
        print(f"An error occurred while connecting to the server: {e}")

async def handleEvent(data, websocket):
    event_type = data.get("type")
    if event_type == "gameStarting":
        print(f"Game will soon be starting...")
    elif event_type == "updateGameState":
        draw_pong_game({"players": data.get("players"), "ball": data.get("ball")})
        print(f"Game ended: {data.get('gameType')}")
    elif event_type == "waitingForOpponent":
        print(f"\nJoined waiting room and now waiting for an opponent...")
    else:
        print(f"Unhandled event type: {event_type}")

async def setupSocketEvents(websocket):
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                await handleEvent(data, websocket)
            except json.JSONDecodeError:
                print(f"\nReceived non-JSON message: {message}")
            print("Enter a command: ", end="", flush=True)
    except Exception as e:
        print(f"An error occurred: {e}")

def printHelpMessage():
    print("Available commands:")
    print("1. 'help' - Show this help message")
    print("2. 'exit' - Exit the application")
    print("3. 'join' - Join a waiting room for a game")
    print("4. 'leave' - Leave the waiting room")

async def handleCommand(command, websocket, loop):
    if command == "help":
        printHelpMessage()
    elif command == "exit":
        print("Exiting the application...")
        await websocket.close()
        return False
    elif command == "join":
        gameType = await loop.run_in_executor(None, input, "Enter the game type (pong or snake): ")
        await websocket.send(json.dumps({"type": "joinWaitingRoom", "gameType": gameType}))
    elif command == "leave":
        await websocket.send(json.dumps({"type": "leaveWaitingRoom"}))
    else:
        await websocket.send(command)
        print(f"Sent command: {command}")
    return True

async def handleUserInput(websocket):
    printHelpMessage()
    try:
        loop = asyncio.get_event_loop()
        while True:
            command = await loop.run_in_executor(None, input, "Enter a command: ")
            if await handleCommand(command, websocket, loop) is False:
                break
    except Exception as e:
        print(f"Failed to send message: {e}")