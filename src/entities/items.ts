import { TILE_COUNT } from "../constants/config";
import { type ItemType, state } from "../states/gameState";

// Checa se a coordenada está livre (sem cobra e sem pedras)
function isPositionSafe(x: number, y: number): boolean {
  const onSnake = state.snake.some(
    (segment) => segment.x === x && segment.y === y,
  );
  const onObstacle = state.obstacles.some((obs) => obs.x === x && obs.y === y);
  return !onSnake && !onObstacle;
}

export function spawnItem() {
  let newX: number;
  let newY: number;

  do {
    newX = Math.floor(Math.random() * TILE_COUNT);
    newY = Math.floor(Math.random() * TILE_COUNT);
  } while (!isPositionSafe(newX, newY));

  // Mais chances de vir comida normal
  const types: ItemType[] = [
    "food",
    "food",
    "food",
    "extra_points",
    "earth_fruit",
    "ice_fruit",
    "fire_fruit",
  ];
  const randomType = types[Math.floor(Math.random() * types.length)];

  state.currentItem = { x: newX, y: newY, type: randomType };
}

export function spawnObstacles(now: number) {
  // Cria 6 pedras pelo mapa que duram 5 segundos
  for (let i = 0; i < 6; i++) {
    let ox: number;
    let oy: number;

    do {
      ox = Math.floor(Math.random() * TILE_COUNT);
      oy = Math.floor(Math.random() * TILE_COUNT);
    } while (
      !isPositionSafe(ox, oy) &&
      (state.currentItem.x !== ox || state.currentItem.y !== oy)
    );

    state.obstacles.push({ x: ox, y: oy, expiresAt: now + 5000 });
  }
}
