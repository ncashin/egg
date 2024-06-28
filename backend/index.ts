import type { ServerWebSocket } from "bun";
import EventType, {
  COYOTE_TIME,
  initialGameState,
  intialEntity,
  update,
  type GameState,
} from "../game";

type Connection = {
  id: number;
};

let connectedSockets: ServerWebSocket<Connection>[] = [];
let id = 0;
Bun.serve<Connection>({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req), {headers: {
      "Set-Cookie": `SessionID=${id++}`,
      data: {
        id: id++,
      }
    },}) {
      return; // do not return a Response
    }
    return new Response("websocket upgrade failed", { status: 500 });
  }, // upgrade logic
  websocket: {
    open(socket) {
      gameState.entities[socket.data.id] = {...intialEntity};
      connectedSockets.push(socket);
    }, // a socket is opened
    message(socket, message) {
      const socketID = socket.data.id
      const event = Number(message);
      switch (event) {
        case EventType.MOVE_NONE: {
          gameState.entities[socketID].isMoving = false;
          break;
        }
        case EventType.MOVE_LEFT: {
          gameState.entities[socketID].isMoving = true;
          gameState.entities[socketID].isMovingLeft = true;
          break;
        }
        case EventType.MOVE_RIGHT: {
          gameState.entities[socketID].isMoving = true;
          gameState.entities[socketID].isMovingLeft = false;
          break;
        }
        case EventType.JUMP: {
          gameState.entities[socketID].coyoteTime = COYOTE_TIME;
          break;
        }
      }
    }, // a message is received
    close(socket, code, message) {
      delete gameState.entities[socket.data.id];
    }, // a socket is closed
    drain(socket) {}, // the socket is ready to receive more data
  },
});

const TICK_RATE = 16.666;
let gameState: GameState = initialGameState;
let previousTime = 0;
const loop = () => {
  update(gameState, TICK_RATE);
  for (var connection of connectedSockets) {
    connection.send(JSON.stringify(gameState));
  }
};
setInterval(loop, TICK_RATE);
