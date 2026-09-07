import { GRID_SIZE, TILE_COUNT } from "../constants/config";
import { state } from "../states/gameState";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const gameOverScreen = document.getElementById(
  "game-over-screen",
) as HTMLElement;
const scoreElement = document.getElementById("score") as HTMLElement;
const startScreen = document.getElementById("start-screen") as HTMLElement;
const finalScoreElement = document.getElementById('final-score') as HTMLElement;
const powerupHud = document.getElementById('powerup-hud') as HTMLElement;
const powerupName = document.getElementById('powerup-name') as HTMLElement;
const powerupDesc = document.getElementById('powerup-desc') as HTMLElement;
const powerupTimer = document.getElementById('powerup-timer') as HTMLElement;
const powerupBarFill = document.getElementById('powerup-bar-fill') as HTMLElement;
const powerupIcon = document.getElementById('powerup-icon') as HTMLElement;

export function draw() {
  ctx.fillStyle = "#202024";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Desenha o Grid (Linhas cinzas)
  ctx.strokeStyle = "#323238"; // Cinza sutil para as linhas
  ctx.lineWidth = 1;

  for (let i = 0; i <= TILE_COUNT; i++) {
    // Linhas verticais
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, canvas.height);
    ctx.stroke();

    // Linhas horizontais
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(canvas.width, i * GRID_SIZE);
    ctx.stroke();
  }

  // 3. Desenha a Cobra por cima do Grid
  ctx.fillStyle = "#04d361";
  state.snake.forEach((segment) => {
    const padding = 4;
    const offset = padding / 2;

    ctx.fillRect(
      (segment.x * GRID_SIZE) + offset,
      (segment.y * GRID_SIZE) + offset,
      GRID_SIZE - padding,
      GRID_SIZE - padding,
    );
  });

  const padding = 4;
  const offset = padding / 2;
  const renderSize = GRID_SIZE - padding;

  // 4. Pinta as Pedras (Obstáculos)
  ctx.fillStyle = '#737380'; // Cinza chumbo
  state.obstacles.forEach((obs) => {
    ctx.fillRect((obs.x * GRID_SIZE) + offset, (obs.y * GRID_SIZE) + offset, renderSize, renderSize);
  });

  // 5. Pinta o Item Atual baseado no tipo
  if (state.currentItem.type === 'earth_fruit') ctx.fillStyle = '#6c360f';
  else if (state.currentItem.type === 'ice_fruit') ctx.fillStyle = '#00BFFF';
  else if (state.currentItem.type === 'extra_points') ctx.fillStyle = '#e1e1e6';
  else if (state.currentItem.type === 'fire_fruit') ctx.fillStyle = '#ff8000';
  else ctx.fillStyle = '#ff0055';

  ctx.fillRect(
    (state.currentItem.x * GRID_SIZE) + offset,
    (state.currentItem.y * GRID_SIZE) + offset,
    renderSize,
    renderSize
  );
}

export function updateUI() {
  scoreElement.innerText = state.score.toString();

  // Controle da Tela Inicial
  if (!state.isGameStarted) {
    startScreen.classList.remove('hidden');
    return;
  } else {
    startScreen.classList.add('hidden');
  }

  // Controle do Game Over
  if (state.isGameOver) {
    gameOverScreen.classList.remove('hidden');
    if (finalScoreElement) {
      finalScoreElement.innerText = state.score.toString();
    }
  } else {
    gameOverScreen.classList.add('hidden');
  }

  const now = Date.now();
  let activeEffect = '';
  let timeLeft = 0;
  const totalTime = 5000; // Efeitos duram 5 segundos

  // Descobre quem está ativo e quanto tempo falta
  if (state.iceEffectExpiration > now) {
    activeEffect = 'ice';
    timeLeft = state.iceEffectExpiration - now;
  } else if (state.fireEffectExpiration > now) {
    activeEffect = 'fire';
    timeLeft = state.fireEffectExpiration - now;
  }

  // Se tem efeito rolando, desenha o HUD
  if (activeEffect) {
    powerupHud.classList.remove('hidden');

    // Calcula os segundos com 1 casa decimal (ex: 3.7s)
    const seconds = (timeLeft / 1000).toFixed(1);
    powerupTimer.innerText = `${seconds}s`;

    // Calcula a porcentagem da barra para ela ir encolhendo
    const percent = (timeLeft / totalTime) * 100;
    powerupBarFill.style.width = `${percent}%`;

    // Troca as cores e textos dependendo da fruta
    if (activeEffect === 'ice') {
      powerupIcon.innerText = '❄️';
      powerupName.innerText = 'Gelo';
      powerupName.style.color = '#00BFFF';
      powerupDesc.innerText = 'lento - mais tempo pra pensar';
      powerupBarFill.style.backgroundColor = '#00BFFF';
    } else if (activeEffect === 'fire') {
      powerupIcon.innerText = '🔥';
      powerupName.innerText = 'Fogo';
      powerupName.style.color = '#FF4500';
      powerupDesc.innerText = 'frenético - pontos x3';
      powerupBarFill.style.backgroundColor = '#FF4500';
    }
  } else {
    // Sem efeito, o HUD some
    powerupHud.classList.add('hidden');
  }
}
