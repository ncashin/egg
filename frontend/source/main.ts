import { GameState, GRID_HEIGHT, GRID_WIDTH, initialGameState, TILE_SIZE, update } from "../../game";

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
  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      context.fillStyle = gameState.grid[x][y].isLand ? "green" : "blue";
      context.fillRect(TILE_SIZE * x, TILE_SIZE * y, TILE_SIZE, TILE_SIZE);
    }
  }
};

document.addEventListener("onclick", (MouseEvent) =>{

})

window.addEventListener("close", () => socket.close());
let previousTime = 0;
const renderloop = (time: DOMHighResTimeStamp) => {
  render(gameState);
  let deltaTime = time - previousTime;
  previousTime = time;
  update(gameState, deltaTime);

  window.requestAnimationFrame(renderloop);
};
window.requestAnimationFrame(renderloop);
