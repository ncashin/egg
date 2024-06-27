import { executeFrame, GameState } from "./game";

const SERVER_IP = "http://localhost:8080/ws";
const socket = new WebSocket(SERVER_IP);
socket.addEventListener("message", (event) => {});

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d")!;

const gameState: GameState;
const render = (gameState: GameState) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    context.fillRect(entity.x, entity.y, entity.width, entity.height);
  }
};

const keymap = {};
document.addEventListener("keydown", (event: KeyboardEvent) => {
  keymap[event.code] = true;
});
document.addEventListener("keyup", (event: KeyboardEvent) => {
  keymap[event.code] = false;
});

const renderloop = (time: DOMHighResTimeStamp) => {
  executeFrame(gameState);
  render(gameState);

  window.requestAnimationFrame(renderloop);
};
window.requestAnimationFrame(renderloop);
