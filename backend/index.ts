import type { ServerWebSocket } from "bun";
import { initialGameState, GameState, update } from "../game";

type Connection = {
  id: number;
  socket: ServerWebSocket<unknown>;
};
let connectedSockets: Connection[] = [];
let id = 0;
Bun.serve({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("websocket upgrade failed", { status: 500 });
  }, // upgrade logic
  websocket: {
    open(socket) {
      connectedSockets.push({ id: id++, socket });
      gameState.coordinate.push([0, 0]);
    }, // a socket is opened
    message(socket, message) {
      const coordinate = message
        .toString()
        .split(" ")
        .map((string) => Number(string));
      gameState.coordinate[
        connectedSockets.find((connection) => connection.socket === socket)!.id
      ] = coordinate;
    }, // a message is received
    close(socket, code, message) {}, // a socket is closed
    drain(socket) {}, // the socket is ready to receive more data
  },
});

console.log("HELLO WORLD");

const TICK_RATE = 16.666;

let gameState: GameState = initialGameState;
let previousTime = 0;
const loop = () => {
  console.log("TICK RATE TEST: ", TICK_RATE);
  update(gameState, TICK_RATE);
  for (var connection of connectedSockets) {
    connection.socket.send(JSON.stringify(gameState));
  }
  setTimeout(loop, TICK_RATE);
};
setTimeout(loop, TICK_RATE);
