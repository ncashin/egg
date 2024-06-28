import type { ServerWebSocket } from "bun";
import {
  initialGameState,
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
      connectedSockets.push(socket);
    }, // a socket is opened
    message(socket, message) {
      const socketID = socket.data.id
      
    }, // a message is received
    close(socket, code, message) {
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
