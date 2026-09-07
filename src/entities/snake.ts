import { TILE_COUNT } from "../constants/config";
import { state } from "../states/gameState";
import { spawnItem, spawnObstacles } from "./items";

export function updateSnake() {
  if (state.inputQueue.length > 0) {
    state.currentDirection = state.inputQueue.shift() as { x: number, y: number };
  }

  const dir = state.currentDirection;
  if (dir.x === 0 && dir.y === 0) return;

  const head = { x: state.snake[0].x + dir.x, y: state.snake[0].y + dir.y };

  // 1. COLISÕES FATAIS
  if (
    head.x < 0 ||
    head.x >= TILE_COUNT ||
    head.y < 0 ||
    head.y >= TILE_COUNT
  ) {
    state.isGameOver = true;
    return;
  }
  if (
    state.snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    state.isGameOver = true;
    return;
  }
  if (state.obstacles.some((obs) => obs.x === head.x && obs.y === head.y)) {
    state.isGameOver = true;
    return;
  }

  // 2. MOVIMENTO
  state.snake.unshift(head);

  // 3. COMER O ITEM
  const item = state.currentItem;
  if (head.x === item.x && head.y === item.y) {
    const now = Date.now();
    let pointsGained = 0;

    switch (item.type) {
      case "earth_fruit":
        pointsGained = 15;
        spawnObstacles(now);
        break;
      case "ice_fruit":
        pointsGained = 15;
        state.speed = 4; // Fica lerdo
        state.iceEffectExpiration = now + 5000;
        state.fireEffectExpiration = 0; // Apaga o fogo
        break;
      case "fire_fruit":
        pointsGained = 15;
        state.speed = 14; // Fica frenético
        state.fireEffectExpiration = now + 5000;
        state.iceEffectExpiration = 0; // Derrete o gelo
        break;
      case "extra_points":
        pointsGained = 30;
        break;
      default:
        pointsGained = 10;
        break;
    }

    // Enquanto estiver com o power-up de fogo, ganha 3 vezes mais pontos
    if (state.fireEffectExpiration > now) {
      pointsGained *= 3;
    }

    state.score += pointsGained;
    spawnItem();
  } else {
    state.snake.pop(); // Remove o rabo se não comeu
  }
}
