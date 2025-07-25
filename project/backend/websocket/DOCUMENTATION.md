# WebSocket Implementation Documentation

This document provides an in-depth overview of the WebSocket backend implementation, focusing on architecture, connection management, system behavior, and extensibility. For protocol and message type details, see [PROTOCOL.md](./PROTOCOL.md).

## Implementation Overview

The WebSocket backend enables real-time multiplayer game functionality and user presence tracking. It is designed to support multiple concurrent connections per user (e.g., multiple browser tabs), robust error handling, and extensible game logic.

## Main Components

### websocket.js
- **Entry point** for all WebSocket connections.
- **Authentication**: Uses `authControllers.authenticateSocketConnection` to validate incoming connections.
- **Event Handling**: Sets up listeners for `message`, `close`, `error`, and `pong` events on each socket.
- **Message Routing**: Delegates message handling to the appropriate manager based on message type.
- **Connection Lifecycle**: Handles new connections, disconnections, and error scenarios.

### Managers
- **Connection Manager** (`managers/connectionManager.js`):
  - Maintains a map of all connected users and their active connections.
  - Supports multiple connections per user (multi-tab/multi-device).
  - Provides utilities to add/remove connections, query by user/session, and print connection status.
- **Pong Manager** (`managers/gameManager.js`):
  - Manages waiting lists, active games, and player states.
  - Handles player matchmaking, game creation, and removal.
  - Processes in-game actions and player disconnections.
  - Provides system status reporting for debugging and monitoring.
- **Message Manager** (`managers/messageManager.js`):
  - Centralizes all outgoing communication to clients.
  - Supports broadcasting to all sockets or targeting specific sockets.
  - Handles error reporting to clients.

### Models
- **Connection**: Represents a user's WebSocket connection, including user/session IDs and state (`idle`, `waitingRoom`, `inGame`).
- **Pong**: Encapsulates game logic, player management, and game state.
- **Player**: Represents a player in a game, including paddle position and score.
- **Ball**: Manages ball position, movement, and collision logic for Pong-like games.

## Connection and User State Management
- Each user can have multiple active connections (e.g., multiple browser tabs).
- User state transitions: `idle` → `waitingRoom` → `inGame` (and back).
- When a user disconnects, all their connections are cleaned up, and their state is updated.
- If a user logs out, all their sockets receive a `logoutRequest` message.

## Pong Lifecycle
- Players join the waiting room to be matched for a game.
- When two players are available, a new game is created, and both are notified.
- Pong state is managed and updated in real time, with updates sent to both players.
- If a player disconnects or leaves, the game is stopped, and the opponent is notified.

## Error Handling
- All errors are caught and sent to the client using the message manager.
- Critical errors (e.g., malformed messages, internal exceptions) result in the socket being closed with an appropriate code.
- Error messages are structured and informative for easier debugging on the client side.

## System Status and Debugging
- The game manager and connection manager provide status reports, including:
  - Number of waiting players
  - Number of active games
  - List of connected users and their connection counts
- These reports are logged to the console for monitoring and debugging.

## Extensibility
- The architecture supports adding new game types or features by implementing new managers and models.
- To add a new message type, update the message routing in `websocket.js` and implement the logic in the relevant manager.
- The protocol is documented separately in [PROTOCOL.md](./PROTOCOL.md) for easy reference and extension.

## Security Considerations
- All connections are authenticated before being allowed to interact with the system.
- Session and user IDs are validated for each action.
- Error handling ensures that malformed or malicious messages do not crash the server.

---
For protocol and message type details, see [PROTOCOL.md](./PROTOCOL.md).
For further details, consult the source code in the respective files under `websocket/`.
