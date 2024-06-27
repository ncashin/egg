import { update, GameState } from "./game";

let gameState: GameState = {};
const WEBSOCKET_URL = "http://localhost:8080/";
const socket = new WebSocket(WEBSOCKET_URL);
socket.addEventListener("message", (event) => {
  gameState = event.data;
});

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d")!;

const render = (gameState: GameState) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
};

let previousTime = 0;
const renderloop = (time: DOMHighResTimeStamp) => {
  render(gameState);
  let deltaTime = time - previousTime;
  previousTime = time;
  update(gameState, deltaTime);

  window.requestAnimationFrame(renderloop);
};
window.requestAnimationFrame(renderloop);
