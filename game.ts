export const GRAVITY = 2;
export const COYOTE_TIME = 32.222;

enum EventType {
  MOVE_NONE = 0,
  MOVE_LEFT = 1,
  MOVE_RIGHT = 2,
  JUMP = 3,
}
export default EventType;
export type Entity = {
  x: number;
  y: number;
  velocityY: number;

  coyoteTime: number;
  isMoving: boolean;
  isMovingLeft: boolean;
};
export const intialEntity = {
    x: 0,
    y: 0,
    velocityY: 0,

    coyoteTime: 0,
    isMoving: false,
    isMovingLeft: false,
};
type Dictionary<T>  = {
    [key: number]: T;
};
export type GameState = {
  entities: Dictionary<Entity>;
};

export const initialGameState: GameState = {
  entities: {},
};
export const update = (gameState: GameState, deltaTime: number) => {
    for(const key in gameState.entities){
        var entity = gameState.entities[key];
        if(entity.isMoving){
            entity.x += entity.isMovingLeft ? -5 : 5;
        }
    
        entity.y += entity.velocityY;
        entity.velocityY += GRAVITY;
        if(entity.y > 400){
            entity.y = 400;
            entity.velocityY = 0;
            if(entity.coyoteTime > 0){
                entity.velocityY += -20;
                entity.coyoteTime = 0;
            }
        }
    
        entity.coyoteTime -= deltaTime;
    }
};
