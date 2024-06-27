export type Entity = {

}

export type GameState = {
    coordinate: number[][];
}
export const initialGameState: GameState = {
    coordinate: [],
}
export const update = (gameState: GameState, deltaTime: number) => {
    gameState.coordinate.forEach((coordinate)=> coordinate[0] += 5 * deltaTime / 1000)
};