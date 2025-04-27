## 🧩 Complete Snake Game WebSocket Event Timeline

| Step | Actor        | Action                           | Message Sent                                                      | What Happens                                                      |
|------|--------------|----------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------|
| 1    | Frontend     | Opens WebSocket connection       | `new WebSocket('wss://...')`                                      | WebSocket connection is initiated                                |
| 2    | Backend      | Sends player ID                  | `{ type: 'playerId', playerId: 'abc123' }`                         | Frontend stores `currentPlayerId`                                |
| 3    | Backend      | Sends waiting room list          | `{ type: 'waitingRoom', players: [...] }`                          | Frontend updates and displays list of other available players    |
| 4    | Frontend     | Sends game invitation            | `{ type: 'gameInvitation', opponentId, inviterId }`               | Backend receives and forwards to the opponent                    |
| 5    | Backend      | Sends invitation to opponent     | `{ type: 'gameInvitationReceived', inviterId }`                   | Opponent sees a popup to accept or decline                       |
| 6A   | Opponent     | Accepts the invitation           | `{ type: 'gameAccepted', inviterId, opponentId }`                 | Backend notifies inviter; frontend hides popup                   |
| 7A   | Backend      | Notifies inviter of acceptance   | `{ type: 'gameAccepted' }`                                        | Game starts on both clients                                      |
| 6B   | Opponent     | Declines the invitation          | `{ type: 'gameDenied', inviterId, opponentId }`                   | Backend informs inviter of rejection                             |
| 7B   | Backend      | Notifies inviter of denial       | `{ type: 'gameDenied' }`                                          | Frontend shows "rejected" message                                |
| 8    | Backend      | Sends game state updates         | `{ type: 'stateUpdate', leftPlayer, rightPlayer, apple }`         | Frontend updates canvas with new game state                      |
| 9    | Frontend     | Sends key press (movement)       | `{ type: 'move', key: 'ArrowRight' }`                             | Backend receives move and updates state                          |
| 10   | Backend      | Sends updated game state again   | `{ type: 'stateUpdate', ... }`                                    | Frontend re-renders game board                                   |
| 11   | Frontend     | Tab visibility changes to hidden | `{ type: 'stopGame', inviterId, opponentId }`                     | Game is stopped, animation canceled                              |