## WebSocket Message Types

This section documents all message types handled by the WebSocket backend, including both incoming (client → server) and outgoing (server → client) messages.

### Incoming Message Types (Client → Server)

| Type                 | Description                                           | Payload Example                     |
|----------------------|-------------------------------------------------------|-------------------------------------|
| `joinWaitingRoom`    | Request to join the waiting room for matchmaking.     | `{ type: 'joinWaitingRoom' }`       |
| `leaveWaitingRoom`   | Request to leave the waiting room.                    | `{ type: 'leaveWaitingRoom' }`      |
| `move`               | Send a move/input command during a game.              | `{ type: 'move', direction: 'up' }` |
| `stopGame`           | Request to stop the current game.                     | `{ type: 'stopGame' }`              |
| `disconnectFromGame` | Notify server of voluntary disconnection from a game. | `{ type: 'disconnectFromGame' }`    |

### Outgoing Message Types (Server → Client)

| Type                   | Description                                                               | Payload Example                                                                  |
|------------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| `waitingForOpponent`   | Notifies player they are in the waiting room, waiting for match.          | `{ type: 'waitingForOpponent' }`                                                 |
| `gameStarting`         | Notifies both players that a game is starting.                            | `{ type: 'gameStarting', opponent1: 'userId1', opponent2: 'userId2' }`           |
| `updateGameState`      | Sends the current game state (positions, scores, etc).                    | `{ type: 'updateGameState', players: [player1, player2], ball: 'Ball' }`         |
| `opponentDisconnected` | Notifies player that their opponent has disconnected.                     | `{ type: 'opponentDisconnected', reason: 'reason' }`                             |
| `logoutRequest`        | Instructs all sockets of a user to log out.                               | `{ type: 'logoutRequest' }`                                                      |
| `error`                | Sends error details to the client.                                        | `{ type: 'error', message: 'message' }`                                          |
| `onlineUsers`          | Sends updated list of online users.                                       | `{ type: 'onlineUsers', users: [...] }`                                          |
| `gameOver`             | Notifies both players that the game has ended.                            | `{ type: 'gameOver', players: [player1, player2], winner: 'userId' }`            |
| `socketRejection`      | Notifies the client that an action was rejected, with a code and message. | `{ type: 'socketRejection', code: 4002, message: 'You are already in a game.' }` |

---

## Detailed Message Descriptions

### Incoming Messages (Client → Server)

**joinWaitingRoom**
- Sent by the client to request entry into the matchmaking queue.
- No additional fields.
- If the user is already in a game or waiting room, the request is rejected.

**leaveWaitingRoom**
- Sent by the client to leave the waiting room before being matched.
- No additional fields.
- If the user is not in the waiting room, the request is ignored or rejected.

**move**
- Sent by the client to indicate a paddle movement during a game.
- Payload: `{ type: 'move', direction: 'up' }`
    - `direction`: Can be `'up'`, `'down'` (depending on game logic).
- Only valid if the user is currently in a game.


The stopGame and disconnectFromGame messages are pretty much the same, they just serve different messages to the opponent. 
**stopGame**
- Sent by the client to request that the current game be stopped.
- No additional fields.
- Both players are notified and the game is ended.
- Will also remove the player from the waiting list if applicable.

**disconnectFromGame**
- Sent by the client to voluntarily leave a game (e.g., closing a tab or navigating away).
- No additional fields.
- The opponent is notified and the game is ended.
- Will also remove the player from the waiting list if applicable.

### Outgoing Messages (Server → Client)

**waitingForOpponent**
- Sent to a player after joining the waiting room, indicating they are waiting to be matched.
- No additional fields.

**gameStarting**
- Sent to both players when a match is found and a game is starting.
- Payload: `{ type: 'gameStarting', opponent1: 'userId1', opponent2: 'userId2' }`
    - `userId1`, `userId2`: User IDs of the matched players.

**updateGameState**
- Sent to both players to update them on the current game state (positions, scores, etc.).
- Payload example:
  ```json
  {
    "type": "updateGameState",
    "players": [
      {
        "playerName": "user1",
        "paddleY": 150,
        "paddleX": 0,
        "score": 2
      },
      {
        "playerName": "user2",
        "paddleY": 180,
        "paddleX": 800,
        "score": 3
      }
    ],
    "ball": {
      "x": 100,
      "y": 200,
      "size": 10
    }
  }
  ```
- The `players` array contains objects for each player, with:
    - `playerName`: The user's ID or name.
    - `paddleY`: The vertical position of the paddle.
    - `paddleX`: The horizontal position of the paddle (0 for left, 800 for right).
    - `score`: The player's current score.
- The `ball` object contains:
    - `x`, `y`: The position of the ball.
    - `size`: The size of the ball.

**opponentDisconnected**
- Sent to a player if their opponent disconnects or leaves the game.
- Payload: `{ type: 'opponentDisconnected', reason: 'reason' }`
    - `reason`: A string describing why the opponent disconnected.

**logoutRequest**
- Sent to all sockets of a user when a logout is triggered (e.g., from another tab).
- No additional fields.
- The client should close the connection, clear session data (like cookies).

**error**
- Sent to the client when an error occurs (e.g., invalid action, server error).
- Payload: `{ type: 'error', message: 'message' }`
    - `message`: A string describing the error.

**onlineUsers**
- Sent to clients to update them on the list of currently online users.
- Payload: `{ type: 'onlineUsers', users: [...] }`
    - `users`: An array of user IDs.
- This message gets send everytime a user opens it's first connection or closes it's last connection. This means that f.e. a user opening a new tab will not trigger this message.

**gameOver**
- Sent to both players when the game has ended (e.g., a player reaches the score limit or disconnects).
- Payload example:
  ```json
  {
    "type": "gameOver",
    "players": [
      {
        "playerName": "user1",
        "paddleY": 150,
        "paddleX": 0,
        "score": 3
      },
      {
        "playerName": "user2",
        "paddleY": 180,
        "paddleX": 800,
        "score": 2
      }
    ],
    "winner": "user1"
  }
  ```
- The `players` array contains objects for each player, with:
    - `playerName`: The user's ID or name.
    - `paddleY`: The vertical position of the paddle.
    - `paddleX`: The horizontal position of the paddle (0 for left, 800 for right).
    - `score`: The player's final score.
- The `winner` field contains the user ID of the winning player.
- Both players should handle this message by displaying the result and cleaning up the game state.

**socketRejection**
- Sent to the client when an action is rejected due to a protocol or state violation (e.g., trying to join a game while already in one).
- Payload example:
  ```json
  {
    "type": "socketRejection",
    "code": 4002,
    "message": "You are already in a game."
  }
  ```
- The `code` field is a numeric code indicating the reason for rejection. Possible codes are:
    - `4001`: Not authenticated (`NOT_AUTHENTICATED`)
    - `4002`: Already in a game (`PLAYER_IN_GAME`)
    - `4003`: Already in waiting list (`PLAYER_IN_WAITING_ROOM`)
    - `4004`: Not in waiting list (`NOT_IN_WAITING_ROOM`)
    - `4005`: Not in game (`NOT_IN_GAME`)
    - `4006`: Wrong direction (`WRONG_DIRECTION`)
- The `message` field is a human-readable explanation of the rejection reason.
- Clients should handle this message by displaying the message to the user and taking appropriate action (e.g., disabling a button, showing an error popup).

---

## Message Flow Details
- **Incoming messages** are handled in `handleMessage(connection, data)` in `websocket.js`.
- **Outgoing messages** are sent using the `messageManager` (see `managers/messageManager.js`).
- Some outgoing messages are broadcast to all sockets, while others are sent to a single socket.

## Extending Message Types
To add new message types:
1. Update the `handleMessage` function in `websocket.js` for incoming types.
2. Use `messageManager.createBroadcast()` or similar methods for outgoing types.
3. Document the new type here.
