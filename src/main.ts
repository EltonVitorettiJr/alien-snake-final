import { updateSnake } from "./entities/snake";
import { state } from "./states/gameState";
import { setupInput } from "./systems/input";
import { draw, updateUI } from "./systems/renderer";

function gameLoop(timestamp: number) {
  if (state.isGameOver || !state.isGameStarted) {
    draw();
    updateUI();
    return;
  }

  window.requestAnimationFrame(gameLoop);

  if (state.isPaused) {
    return;
  }

  const now = Date.now();

  // 1. Remove pedras que já derreteram/expiraram
  state.obstacles = state.obstacles.filter(obs => obs.expiresAt > now);

  // 2. Volta a velocidade ao normal (8) se os poderes acabaram
  if (state.iceEffectExpiration > 0 && now > state.iceEffectExpiration) {
    state.speed = 8;
    state.iceEffectExpiration = 0;
  }
  if (state.fireEffectExpiration > 0 && now > state.fireEffectExpiration) {
    state.speed = 8;
    state.fireEffectExpiration = 0;
  }

  const deltaTime = (timestamp - state.lastTime) / 1000;
  if (deltaTime < 1 / state.speed) return;

  state.lastTime = timestamp;

  updateSnake();
  draw();
  updateUI();
}

// Inicia os inputs passando a função de reiniciar o loop como callback
setupInput(() => window.requestAnimationFrame(gameLoop));

// Dá a primeira partida
window.requestAnimationFrame(gameLoop);
