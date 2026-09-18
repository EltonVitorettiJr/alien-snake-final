import { TILE_COUNT } from "../constants/config";
import { state } from "../states/gameState";
import { playSound } from "../systems/audio";
import { spawnItem, spawnObstacles } from "./items";

export function updateSnake() {
  // CONTROLE DE DIREÇÕES
  if (state.inputQueue.length > 0) {
    state.currentDirection = state.inputQueue.shift() as {
      x: number;
      y: number;
    };
  }

  // Simplificação da direção
  const dir = state.currentDirection;
  if (dir.x === 0 && dir.y === 0) return;

  const head = { x: state.snake[0].x + dir.x, y: state.snake[0].y + dir.y };
  const now = Date.now();
  const isGhost = state.ghostEffectExpiration > now;

  // COLISÕES COM PAREDES (Efeito Fantasma)
  // Os limites do campo são: 0 (teto) a TILE_COUNT (chão)
  // MESMA LÓGICA PARA X e Y
  if (isGhost) {
    if (head.x < 0) head.x = TILE_COUNT - 1;
    if (head.x >= TILE_COUNT) head.x = 0;
    if (head.y < 0) head.y = TILE_COUNT - 1;
    if (head.y >= TILE_COUNT) head.y = 0;
  } else {
    // Morte normal na parede se não for fantasma
    if (
      head.x < 0 ||
      head.x >= TILE_COUNT ||
      head.y < 0 ||
      head.y >= TILE_COUNT
    ) {
      playSound("gameover");
      state.isGameOver = true;
      return;
    }
  }

  // Colisão com próprio corpo
  if (!isGhost) {
    if (
      state.snake.some(
        (segment) => segment.x === head.x && segment.y === head.y,
      )
    ) {
      playSound("gameover");
      state.isGameOver = true;
      return;
    }
  }

  // Colisão com pedras (Continua fatal sempre)
  if (state.obstacles.some((obs) => obs.x === head.x && obs.y === head.y)) {
    playSound("gameover");
    state.isGameOver = true;
    return;
  }

  const item = state.currentItem;

  // Define que o ímã puxa tudo, exceto veneno, terra e fogo
  const isPullable =
    item.type !== "poison_apple" &&
    item.type !== "earth_fruit" &&
    item.type !== "fire_fruit";

  // EFEITO ÍMÃ (Puxa itens bons pra perto se estiver a 3 blocos de distância)
  if (state.magnetEffectExpiration > now && isPullable) {
    // Math.abs = valor absoluto ("módulo" na matemática), não existe distancia negativa.
    // Ex: abs(-3) = 3
    const dist = Math.abs(head.x - item.x) + Math.abs(head.y - item.y);

    if (dist <= 3) {
      item.x = head.x; // Teleporta o item direto pra boca da cobra!
      item.y = head.y;
    }
  }

  // Salva onde o rabo estava antes de a cobra andar
  state.lastTail = { ...state.snake[state.snake.length - 1] };

  // MOVIMENTO
  state.snake.unshift({ x: head.x, y: head.y });

  // COMER O ITEM
  if (head.x === item.x && head.y === item.y) {
    let pointsGained = 0;

    switch (item.type) {
      case "earth_fruit":
        playSound("eat");
        pointsGained = 15;
        spawnObstacles(now);
        break;
      case "ice_fruit":
        playSound("eat");
        pointsGained = 15;
        state.speed = 4;
        state.iceEffectExpiration = now + 5000;
        state.fireEffectExpiration = 0;
        break;
      case "fire_fruit":
        playSound("eat");
        pointsGained = 15;
        state.speed = 14;
        state.fireEffectExpiration = now + 5000;
        state.iceEffectExpiration = 0;
        break;
      case "extra_points":
        playSound("extra");
        pointsGained = 30;
        break;
      case "ghost_fruit":
        playSound("eat");
        pointsGained = 20;
        state.ghostEffectExpiration = now + 8000;
        break;
      case "magnet_fruit":
        playSound("eat");
        pointsGained = 20;
        state.magnetEffectExpiration = now + 10000;
        break;
      case "poison_apple":
        playSound("eat");
        pointsGained = -10;
        state.poisonEffectExpiration = now + 4000;
        break;
      case "shrink_pill": {
        playSound("eat");
        pointsGained = state.score > 50 ? -50 : 0;
        const newLength = Math.max(3, Math.floor(state.snake.length / 2));
        state.snake = state.snake.slice(0, newLength);
        break;
      }
      default: {
        playSound("eat");
        pointsGained = 10;
        break;
      }
    }

    if (state.fireEffectExpiration > now) pointsGained *= 3;
    state.score += pointsGained;

    // Evita pontuação negativa no veneno e na pílula de encolhimento
    if (state.score < 0) state.score = 0;

    spawnItem();
  } else {
    state.snake.pop(); // Remove o rabo se não comeu
  }
}
