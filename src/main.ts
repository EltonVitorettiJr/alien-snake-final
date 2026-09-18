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
    updateUI();
    return;
  }

  const now = Date.now();

  // Remove pedras que já expiraram
  state.obstacles = state.obstacles.filter(obs => obs.expiresAt > now);

  // Volta a velocidade ao normal se os poderes acabaram
  if (state.iceEffectExpiration > 0 && now > state.iceEffectExpiration) {
    state.speed = 8;
    state.iceEffectExpiration = 0;
  }

  if (state.fireEffectExpiration > 0 && now > state.fireEffectExpiration) {
    state.speed = 8;
    state.fireEffectExpiration = 0;
  }

  // Tempo que se passou entre o último frame renderizado e o frame atual
  // Se a velocidade do jogo dependesse apenas dos frames do monitor, um PC gamer moderno rodando a 144Hz faria a sua
  // cobra andar mais que o dobro da velocidade de um notebook comum rodando a 60Hz.
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
