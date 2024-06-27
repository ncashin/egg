import { GameState, initialGameState, update } from "../../game";

let gameState: GameState = initialGameState;
const WEBSOCKET_URL = "http://localhost:3000/";
const socket = new WebSocket(WEBSOCKET_URL);
socket.addEventListener("message", (event) => {
  gameState = JSON.parse(event.data);
});

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d")!;

const render = (gameState: GameState) => {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  gameState.coordinate.forEach((coordinate) =>
    context.fillRect(coordinate[0], coordinate[1], 100, 100)
  );
};

canvas.addEventListener("mousedown", (event: MouseEvent) => {
  socket.send(event.x + " " + event.y);
});

let previousTime = 0;
const renderloop = (time: DOMHighResTimeStamp) => {
  render(gameState);
  let deltaTime = time - previousTime;
  previousTime = time;
  update(gameState, deltaTime);

  window.requestAnimationFrame(renderloop);
};
window.requestAnimationFrame(renderloop);
