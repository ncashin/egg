type Dictionary<T> = {
  [key: number]: T;
};
export type Tile = {
  isLand: boolean;
};
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 30;
export const TILE_SIZE = 20;
const getSurroundingTiles = (grid: Tile[][], x: number, y: number): Tile[] =>{
    let tiles: Tile[] = [];
    if(x + 1 < GRID_WIDTH){
        tiles.push(grid[x+1][y])
        if(y + 1 < GRID_HEIGHT){
            tiles.push(grid[x+1][y+1])
        }
        if(y - 1 > 0){
            tiles.push(grid[x+1][y-1])
        }
    }
    if(x - 1 > 0){
        tiles.push(grid[x-1][y])
        if(y + 1 < GRID_HEIGHT){
            tiles.push(grid[x-1][y+1])
        }
        if(y - 1 > 0){
            tiles.push(grid[x-1][y-1])
        }
    }
    if(y + 1 < GRID_HEIGHT){
        tiles.push(grid[x][y+1])
    }
    if(y - 1 > 0){
        tiles.push(grid[x][y-1])
    }
    return tiles;
}
export type GameState = {
  grid: Tile[][];
};
const collapseLand = (grid: Tile[][]) =>{
    for(let x = 0; x < GRID_WIDTH; x++){
        for(let y = 0; y < GRID_HEIGHT; y++){
            let surrounding_tiles = getSurroundingTiles(grid, x, y);
            let obstructed_tile_count = 0;
            for(var tile of surrounding_tiles){
                if(tile.isLand == false){
                    obstructed_tile_count++;
                }
            }
            if(obstructed_tile_count > 4){
                grid[x][y].isLand = false;
            } else if(obstructed_tile_count < 4){
                grid[x][y].isLand = true;
            }
        }
    }
}

const initializeGrid = () => {
    let grid: Tile[][] = [];
  for (let x = 0; x < GRID_WIDTH; x++) {
    grid.push([]);
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[x].push({isLand: Math.random() > 0.5,});
    }
  }

  for(let i = 0; i < 5; i++){
    collapseLand(grid);
  }
  
  return grid;
};
export const initialGameState: GameState = {
  grid: initializeGrid(),
};
export const update = (gameState: GameState, deltaTime: number) => {

};
