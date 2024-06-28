import EventType, { GameState, initialGameState, update } from "../../game";

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
  for (const key in gameState.entities) {
    var entity = gameState.entities[key];
    context.fillRect(entity.x, entity.y, 100, 100);
  }
};

let keymap = {};
document.addEventListener("keypress", (event: KeyboardEvent) => {
  keymap[event.code] = true;
});
document.addEventListener("keyup", (event: KeyboardEvent) => {
  keymap[event.code] = false;
});
const inputUpdate = () => {
  if (keymap["Space"]) {
    socket.send(String(EventType.JUMP));
  }
  if (keymap["KeyA"]) {
    socket.send(String(EventType.MOVE_LEFT));
  }
  if (keymap["KeyD"]) {
    socket.send(String(EventType.MOVE_RIGHT));
  }
  if (!keymap["KeyA"] && !keymap["KeyD"]) {
    socket.send(String(EventType.MOVE_NONE));
  }
};
window.addEventListener("close", () => socket.close());
let previousTime = 0;
const renderloop = (time: DOMHighResTimeStamp) => {
  inputUpdate();
  render(gameState);
  let deltaTime = time - previousTime;
  previousTime = time;
  update(gameState, deltaTime);

  window.requestAnimationFrame(renderloop);
};
window.requestAnimationFrame(renderloop);
