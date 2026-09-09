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
const highScoreElement = document.getElementById('high-score') as HTMLElement;
const snakeSizeElement = document.getElementById('snake-size') as HTMLElement;
const startScreenRecord = document.getElementById('start-screen-record') as HTMLElement;
const pauseScreen = document.getElementById('pause-screen') as HTMLElement;

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
  const isGhost = state.ghostEffectExpiration > Date.now();

  if (isGhost) {
    ctx.globalAlpha = 0.4; // Deixa a cobra 60% transparente!
  }

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

  ctx.globalAlpha = 1.0;

  const padding = 4;
  const offset = padding / 2;
  const renderSize = GRID_SIZE - padding;

  // 4. Pinta as Pedras (Obstáculos)
  ctx.fillStyle = '#737380'; // Cinza chumbo
  state.obstacles.forEach((obs) => {
    ctx.fillRect((obs.x * GRID_SIZE) + offset, (obs.y * GRID_SIZE) + offset, renderSize, renderSize);
  });

  // 5. Pinta o Item Atual baseado no tipo
  if (state.currentItem.type === 'earth_fruit') ctx.fillStyle = '#8B4513';
  else if (state.currentItem.type === 'ice_fruit') ctx.fillStyle = '#00BFFF';
  else if (state.currentItem.type === 'extra_points') ctx.fillStyle = '#efefef';
  else if (state.currentItem.type === 'fire_fruit') ctx.fillStyle = '#FF4500';
  else if (state.currentItem.type === 'shrink_pill') ctx.fillStyle = '#ffd166';
  else if (state.currentItem.type === 'magnet_fruit') ctx.fillStyle = '#ff70a6';
  else if (state.currentItem.type === 'poison_apple') ctx.fillStyle = '#38b000';
  else if (state.currentItem.type === 'ghost_fruit') ctx.fillStyle = '#9d4edd';
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

  if (startScreenRecord) startScreenRecord.innerText = state.highScore.toString();

  // === LÓGICA DO RECORDE ===
  // Se a pontuação atual passar o recorde, a gente salva na hora!
  if (state.score > state.highScore) {
    state.highScore = state.score;
    localStorage.setItem('alienSnakeRecorde', state.highScore.toString());
  }

  // === ATUALIZA OS TEXTOS NO HTML ===
  if (scoreElement) scoreElement.innerText = state.score.toString();
  if (highScoreElement) highScoreElement.innerText = state.highScore.toString();
  if (snakeSizeElement) snakeSizeElement.innerText = state.snake.length.toString();

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

  // Controle da Tela de Pausa
  if (state.isPaused && state.isGameStarted && !state.isGameOver) {
    if (pauseScreen) pauseScreen.classList.remove('hidden');
  } else {
    if (pauseScreen) pauseScreen.classList.add('hidden');
  }

  // ==========================================
  // HUD DE POWER-UPS
  // ==========================================
  const now = Date.now();
  let activeEffect = '';
  let expiration = 0;
  let totalTime = 5000; // Tempo padrão, mas agora ele muda!

  // 1. Descobre o tempo das pedras (pega a que vai demorar mais pra sumir)
  const maxObstacleTime = state.obstacles.length > 0
    ? Math.max(...state.obstacles.map(obs => obs.expiresAt))
    : 0;

  // 2. Compara todos os efeitos e mostra o que tem o maior tempo restante
  if (state.iceEffectExpiration > now && state.iceEffectExpiration > expiration) {
    activeEffect = 'ice'; expiration = state.iceEffectExpiration; totalTime = 5000;
  }
  if (state.fireEffectExpiration > now && state.fireEffectExpiration > expiration) {
    activeEffect = 'fire'; expiration = state.fireEffectExpiration; totalTime = 5000;
  }
  if (maxObstacleTime > now && maxObstacleTime > expiration) {
    activeEffect = 'earth'; expiration = maxObstacleTime; totalTime = 5000;
  }

  // NOVOS EFEITOS AQUI:
  if (state.ghostEffectExpiration > now && state.ghostEffectExpiration > expiration) {
    activeEffect = 'ghost'; expiration = state.ghostEffectExpiration; totalTime = 8000;
  }
  if (state.magnetEffectExpiration > now && state.magnetEffectExpiration > expiration) {
    activeEffect = 'magnet'; expiration = state.magnetEffectExpiration; totalTime = 10000;
  }
  if (state.poisonEffectExpiration > now && state.poisonEffectExpiration > expiration) {
    activeEffect = 'poison'; expiration = state.poisonEffectExpiration; totalTime = 4000;
  }

  const timeLeft = expiration - now;

  // 3. Atualiza a tela se houver algum efeito rolando
  if (activeEffect && timeLeft > 0) {
    powerupHud.classList.remove('hidden');

    // Atualiza os segundos
    const seconds = (timeLeft / 1000).toFixed(1);
    powerupTimer.innerText = `${seconds}s`;

    // Atualiza a barrinha (agora com a porcentagem perfeita pra cada tempo!)
    const percent = (timeLeft / totalTime) * 100;
    powerupBarFill.style.width = `${percent}%`;

    // Troca as cores e textos dependendo do poder ativo
    if (activeEffect === 'ice') {
      powerupIcon.innerText = '❄️'; powerupName.innerText = 'Gelo';
      powerupName.style.color = '#00BFFF'; powerupDesc.innerText = 'Tempo para pensar...';
      powerupBarFill.style.backgroundColor = '#00BFFF';
    } else if (activeEffect === 'fire') {
      powerupIcon.innerText = '🔥'; powerupName.innerText = 'Fogo';
      powerupName.style.color = '#FF4500'; powerupDesc.innerText = 'Frenético! Pontos x3';
      powerupBarFill.style.backgroundColor = '#FF4500';
    } else if (activeEffect === 'earth') {
      powerupIcon.innerText = '🪨'; powerupName.innerText = 'Terra';
      powerupName.style.color = '#b47b4d'; powerupDesc.innerText = 'Cuidado por onde anda!';
      powerupBarFill.style.backgroundColor = '#b47b4d';
    } else if (activeEffect === 'ghost') {
      powerupIcon.innerText = '👻'; powerupName.innerText = 'Fantasma';
      powerupName.style.color = '#9d4edd'; powerupDesc.innerText = 'Sinto que estou intangível!';
      powerupBarFill.style.backgroundColor = '#9d4edd';
    } else if (activeEffect === 'magnet') {
      powerupIcon.innerText = '🧲'; powerupName.innerText = 'Ímã';
      powerupName.style.color = '#ff70a6'; powerupDesc.innerText = 'Venham para mim!';
      powerupBarFill.style.backgroundColor = '#ff70a6';
    } else if (activeEffect === 'poison') {
      powerupIcon.innerText = '☠️'; powerupName.innerText = 'Veneno';
      powerupName.style.color = '#38b000'; powerupDesc.innerText = 'Controles invertidos, sobreviva!';
      powerupBarFill.style.backgroundColor = '#38b000';
    }
  } else {
    // Sem efeito, esconde o HUD
    powerupHud.classList.add('hidden');
  }
}
