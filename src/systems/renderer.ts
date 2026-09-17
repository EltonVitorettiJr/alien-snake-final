// Importando os Itens e Obstáculos
import appleSvg from "../assets/apple.svg";
import bodySvg from "../assets/body-snake.svg";
import curveSvg from "../assets/curve-snake.svg";
import diamondSvg from "../assets/diamond.svg";
import earthSvg from "../assets/earth.svg";
import fireSvg from "../assets/fire.svg";
import ghostSvg from "../assets/ghost.svg";
import headSvg from "../assets/head-snake.svg";
import headTongueSvg from "../assets/head-tongue.svg";
import iceSvg from "../assets/ice.svg";
import magnetSvg from "../assets/magnet.svg";
import pillSvg from "../assets/pill.svg";
import poisonSvg from "../assets/poison.svg";
import rockSvg from "../assets/rock.svg";
import tailSvg from "../assets/tail-snake.svg";
import { GRID_SIZE, TILE_COUNT } from "../constants/config";
import { state } from "../states/gameState";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const gameOverScreen = document.getElementById(
  "game-over-screen",
) as HTMLElement;
const scoreElement = document.getElementById("score") as HTMLElement;
const startScreen = document.getElementById("start-screen") as HTMLElement;
const finalScoreElement = document.getElementById("final-score") as HTMLElement;
const powerupHud = document.getElementById("powerup-hud") as HTMLElement;
const powerupName = document.getElementById("powerup-name") as HTMLElement;
const powerupDesc = document.getElementById("powerup-desc") as HTMLElement;
const powerupTimer = document.getElementById("powerup-timer") as HTMLElement;
const powerupBarFill = document.getElementById(
  "powerup-bar-fill",
) as HTMLElement;
const powerupIcon = document.getElementById("powerup-icon") as HTMLElement;
const highScoreElement = document.getElementById("high-score") as HTMLElement;
const snakeSizeElement = document.getElementById("snake-size") as HTMLElement;
const startScreenRecord = document.getElementById(
  "start-screen-record",
) as HTMLElement;
const pauseScreen = document.getElementById("pause-screen") as HTMLElement;

const headImg = new Image();
headImg.src = headSvg;
const bodyImg = new Image();
bodyImg.src = bodySvg;
const tailImg = new Image();
tailImg.src = tailSvg;
const curveImg = new Image();
curveImg.src = curveSvg;
const appleImg = new Image();
appleImg.src = appleSvg;
const diamondImg = new Image();
diamondImg.src = diamondSvg;
const fireImg = new Image();
fireImg.src = fireSvg;
const ghostImg = new Image();
ghostImg.src = ghostSvg;
const iceImg = new Image();
iceImg.src = iceSvg;
const magnetImg = new Image();
magnetImg.src = magnetSvg;
const pillImg = new Image();
pillImg.src = pillSvg;
const poisonImg = new Image();
poisonImg.src = poisonSvg;
const rockImg = new Image();
rockImg.src = rockSvg;
const headTongueImg = new Image();
headTongueImg.src = headTongueSvg;
const earthImg = new Image();
earthImg.src = earthSvg;

function drawRotatedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  angle: number,
  scale: number = 1,
) {
  ctx.save();
  const drawSize = size * scale; // Aplica o zoom
  ctx.translate(x * size + size / 2, y * size + size / 2);
  ctx.rotate(angle);
  // Desenha com o tamanho ampliado
  ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  ctx.restore();
}

export function draw() {
  // 1 e 2. Desenha o Fundo Xadrez (Estilo Google)
  for (let row = 0; row < TILE_COUNT; row++) {
    for (let col = 0; col < TILE_COUNT; col++) {
      // O Pulo do Gato Matemático: se a soma da linha com a coluna for par, é uma cor. Se for ímpar, é outra!
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = "#7ea23a"; // Verde clássico do Google
      } else {
        ctx.fillStyle = "#759633"; // Verde um pouquinho mais claro
      }

      ctx.fillRect(col * GRID_SIZE, row * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  }

  // 3. Desenha a Cobra por cima do Grid
  const isGhost = state.ghostEffectExpiration > Date.now();

  if (isGhost) {
    ctx.globalAlpha = 0.4; // Deixa a cobra 60% transparente!
  }

  ctx.fillStyle = "#04d361";
  state.snake.forEach((segment, index) => {
    let angle = 0;
    let imgToDraw = bodyImg;
    let pieceScale = 1;

    // 1. É A CABEÇA
    if (index === 0) {
      // A cada 2000ms (2s), a língua sai por 300ms!
      const isTongueOut = Date.now() % 2000 < 300;
      imgToDraw = isTongueOut ? headTongueImg : headImg;

      if (isTongueOut) {
        pieceScale = 1.5;
      }

      const dir = state.currentDirection;
      if (dir.x === 1) angle = 0;
      else if (dir.x === -1) angle = Math.PI;
      else if (dir.y === 1) angle = Math.PI / 2;
      else if (dir.y === -1) angle = -Math.PI / 2;
    }

    // 2. É O RABO
    else if (index === state.snake.length - 1) {
      imgToDraw = tailImg;
      const prevSegment = state.snake[index - 1];
      if (prevSegment.x > segment.x) angle = 0;
      else if (prevSegment.x < segment.x) angle = Math.PI;
      else if (prevSegment.y > segment.y) angle = Math.PI / 2;
      else if (prevSegment.y < segment.y) angle = -Math.PI / 2;
    }

    // 3. É O CORPO E AS CURVAS
    else {
      const prevSegment = state.snake[index - 1]; // Pedaço da frente
      const nextSegment = state.snake[index + 1]; // Pedaço de trás

      // Se o X e o Y mudaram, é porque é uma QUINA/CURVA
      if (prevSegment.x !== nextSegment.x && prevSegment.y !== nextSegment.y) {
        imgToDraw = curveImg;

        const isUp = prevSegment.y < segment.y || nextSegment.y < segment.y;
        const isDown = prevSegment.y > segment.y || nextSegment.y > segment.y;
        const isLeft = prevSegment.x < segment.x || nextSegment.x < segment.x;
        const isRight = prevSegment.x > segment.x || nextSegment.x > segment.x;

        if (isDown && isLeft) angle = 0;
        else if (isUp && isLeft) angle = Math.PI / 2;
        else if (isUp && isRight) angle = Math.PI;
        else if (isDown && isRight) angle = -Math.PI / 2;
      }
      // Se não for curva, é uma RETA NORMAL
      else {
        imgToDraw = bodyImg;
        if (prevSegment.y !== segment.y) {
          angle = Math.PI / 2;
        }
      }
    }

    // === A MÁGICA DA INTERPOLAÇÃO (LERP) ===
    const now = Date.now();
    const moveInterval = 1000 / state.speed;
    const progress = Math.min((now - state.lastTime) / moveInterval, 1);

    let prevX =
      index < state.snake.length - 1
        ? state.snake[index + 1].x
        : state.lastTail.x;
    let prevY =
      index < state.snake.length - 1
        ? state.snake[index + 1].y
        : state.lastTail.y;

    if (Math.abs(segment.x - prevX) > 1 || Math.abs(segment.y - prevY) > 1) {
      prevX = segment.x;
      prevY = segment.y;
    }

    const renderX = prevX + (segment.x - prevX) * progress;
    const renderY = prevY + (segment.y - prevY) * progress;

    if (state.ghostEffectExpiration > now) {
      ctx.globalAlpha = 0.5;
    }

    // Chama o desenho usando as posições interpoladas
    drawRotatedImage(
      ctx,
      imgToDraw,
      renderX,
      renderY,
      GRID_SIZE,
      angle,
      pieceScale,
    );
    ctx.globalAlpha = 1.0;
  });

  ctx.globalAlpha = 1.0;

  // Liga o modo Sombra
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // Preto com 40% de opacidade
  ctx.shadowBlur = 8; // Deixa esfumaçado
  ctx.shadowOffsetX = 3; // Joga a sombra pra direita
  ctx.shadowOffsetY = 3; // Joga a sombra pra baixo

  // 4. Pinta as Pedras (Obstáculos)
  state.obstacles.forEach((obs) => {
    ctx.drawImage(
      rockImg,
      obs.x * GRID_SIZE,
      obs.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE,
    );
  });

  // 5. Pinta o Item Atual baseado no tipo
  const itemX = state.currentItem.x * GRID_SIZE;
  const itemY = state.currentItem.y * GRID_SIZE;
  let itemImg = appleImg; // Começa com a maçã por padrão

  switch (state.currentItem.type) {
    case "earth_fruit":
      itemImg = earthImg; // A fruta da terra pode usar o ícone da pedra
      break;
    case "ice_fruit":
      itemImg = iceImg;
      break;
    case "fire_fruit":
      itemImg = fireImg;
      break;
    case "extra_points":
      itemImg = diamondImg;
      break;
    case "shrink_pill":
      itemImg = pillImg;
      break;
    case "magnet_fruit":
      itemImg = magnetImg;
      break;
    case "poison_apple":
      itemImg = poisonImg;
      break;
    case "ghost_fruit":
      itemImg = ghostImg;
      break;
    default:
      itemImg = appleImg;
      break;
  }

  ctx.drawImage(itemImg, itemX, itemY, GRID_SIZE, GRID_SIZE);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Desenha o item na tela!
  ctx.drawImage(itemImg, itemX, itemY, GRID_SIZE, GRID_SIZE);
}

export function updateUI() {
  scoreElement.innerText = state.score.toString();

  if (startScreenRecord)
    startScreenRecord.innerText = state.highScore.toString();

  // === LÓGICA DO RECORDE ===
  // Se a pontuação atual passar o recorde, a gente salva na hora!
  if (state.score > state.highScore) {
    state.highScore = state.score;
    localStorage.setItem("alienSnakeRecorde", state.highScore.toString());
  }

  // === ATUALIZA OS TEXTOS NO HTML ===
  if (scoreElement) scoreElement.innerText = state.score.toString();
  if (highScoreElement) highScoreElement.innerText = state.highScore.toString();
  if (snakeSizeElement)
    snakeSizeElement.innerText = state.snake.length.toString();

  // Controle da Tela Inicial
  if (!state.isGameStarted) {
    startScreen.classList.remove("hidden");
    return;
  } else {
    startScreen.classList.add("hidden");
  }

  // Controle do Game Over
  if (state.isGameOver) {
    gameOverScreen.classList.remove("hidden");
    if (finalScoreElement) {
      finalScoreElement.innerText = state.score.toString();
    }
  } else {
    gameOverScreen.classList.add("hidden");
  }

  // Controle da Tela de Pausa
  if (state.isPaused && state.isGameStarted && !state.isGameOver) {
    if (pauseScreen) pauseScreen.classList.remove("hidden");
  } else {
    if (pauseScreen) pauseScreen.classList.add("hidden");
  }

  // ==========================================
  // HUD DE POWER-UPS
  // ==========================================
  const now = Date.now();
  let activeEffect = "";
  let expiration = 0;
  let totalTime = 5000; // Tempo padrão, mas agora ele muda!

  // 1. Descobre o tempo das pedras (pega a que vai demorar mais pra sumir)
  const maxObstacleTime =
    state.obstacles.length > 0
      ? Math.max(...state.obstacles.map((obs) => obs.expiresAt))
      : 0;

  // 2. Compara todos os efeitos e mostra o que tem o maior tempo restante
  if (
    state.iceEffectExpiration > now &&
    state.iceEffectExpiration > expiration
  ) {
    activeEffect = "ice";
    expiration = state.iceEffectExpiration;
    totalTime = 5000;
  }
  if (
    state.fireEffectExpiration > now &&
    state.fireEffectExpiration > expiration
  ) {
    activeEffect = "fire";
    expiration = state.fireEffectExpiration;
    totalTime = 5000;
  }
  if (maxObstacleTime > now && maxObstacleTime > expiration) {
    activeEffect = "earth";
    expiration = maxObstacleTime;
    totalTime = 15000;
  }

  // NOVOS EFEITOS AQUI:
  if (
    state.ghostEffectExpiration > now &&
    state.ghostEffectExpiration > expiration
  ) {
    activeEffect = "ghost";
    expiration = state.ghostEffectExpiration;
    totalTime = 8000;
  }
  if (
    state.magnetEffectExpiration > now &&
    state.magnetEffectExpiration > expiration
  ) {
    activeEffect = "magnet";
    expiration = state.magnetEffectExpiration;
    totalTime = 10000;
  }
  if (
    state.poisonEffectExpiration > now &&
    state.poisonEffectExpiration > expiration
  ) {
    activeEffect = "poison";
    expiration = state.poisonEffectExpiration;
    totalTime = 4000;
  }

  const timeLeft = expiration - now;

  // 3. Atualiza a tela se houver algum efeito rolando
  if (activeEffect && timeLeft > 0) {
    powerupHud.classList.remove("hidden");

    // Atualiza os segundos
    const seconds = (timeLeft / 1000).toFixed(1);
    powerupTimer.innerText = `${seconds}s`;

    // Atualiza a barrinha (agora com a porcentagem perfeita pra cada tempo!)
    const percent = (timeLeft / totalTime) * 100;
    powerupBarFill.style.width = `${percent}%`;

    // Troca as cores e textos dependendo do poder ativo
    if (activeEffect === "ice") {
      powerupIcon.innerText = "❄️";
      powerupName.innerText = "Gelo";
      powerupName.style.color = "#00BFFF";
      powerupDesc.innerText = "Tempo para pensar...";
      powerupBarFill.style.backgroundColor = "#00BFFF";
    } else if (activeEffect === "fire") {
      powerupIcon.innerText = "🔥";
      powerupName.innerText = "Fogo";
      powerupName.style.color = "#FF4500";
      powerupDesc.innerText = "Frenético! Pontos x3";
      powerupBarFill.style.backgroundColor = "#FF4500";
    } else if (activeEffect === "earth") {
      powerupIcon.innerText = "🪨";
      powerupName.innerText = "Terra";
      powerupName.style.color = "#b47b4d";
      powerupDesc.innerText = "Cuidado por onde anda!";
      powerupBarFill.style.backgroundColor = "#b47b4d";
    } else if (activeEffect === "ghost") {
      powerupIcon.innerText = "👻";
      powerupName.innerText = "Fantasma";
      powerupName.style.color = "#9d4edd";
      powerupDesc.innerText = "Sinto que estou intangível!";
      powerupBarFill.style.backgroundColor = "#9d4edd";
    } else if (activeEffect === "magnet") {
      powerupIcon.innerText = "🧲";
      powerupName.innerText = "Ímã";
      powerupName.style.color = "#ff70a6";
      powerupDesc.innerText = "Venham para mim!";
      powerupBarFill.style.backgroundColor = "#ff70a6";
    } else if (activeEffect === "poison") {
      powerupIcon.innerText = "☠️";
      powerupName.innerText = "Veneno";
      powerupName.style.color = "#38b000";
      powerupDesc.innerText = "Controles invertidos, sobreviva!";
      powerupBarFill.style.backgroundColor = "#38b000";
    }
  } else {
    // Sem efeito, esconde o HUD
    powerupHud.classList.add("hidden");
  }
}
