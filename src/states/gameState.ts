export type ItemType = 'food' | 'extra_points' | 'earth_fruit' | 'ice_fruit' | 'fire_fruit' | 'ghost_fruit' | 'magnet_fruit' | 'poison_fruit' | 'shrink_pill' | 'poison_apple';

export const state = {
  snake: [
    { x: 10, y: 10 }, // Cabeça
    { x: 9, y: 10 },  // Corpo (1 bloco pra trás)
    { x: 8, y: 10 }   // Rabo (2 blocos pra trás)
  ],
  lastTail: { x: 8, y: 10 },

  currentItem: { x: 15, y: 15, type: 'food' as ItemType },
  obstacles: [] as { x: number; y: number; expiresAt: number }[],

  inputQueue: [] as { x: number; y: number }[],
  currentDirection: { x: 1, y: 0 },
  score: 0,
  isGameOver: false,
  isGameStarted: false,
  isPaused: false,
  highScore: Number(localStorage.getItem('alienSnakeRecorde')) || 0,

  // Controle de Tempo e Velocidade
  lastTime: 0,
  speed: 8,
  iceEffectExpiration: 0,
  fireEffectExpiration: 0,
  earthEffectExpiration: 0,
  ghostEffectExpiration: 0,
  magnetEffectExpiration: 0,
  poisonEffectExpiration: 0,
};

export function resetState() {
  state.snake = [
    { x: 10, y: 10 }, // Cabeça
    { x: 9, y: 10 },  // Corpo
    { x: 8, y: 10 }   // Rabo
  ];
  state.lastTail = { x: 8, y: 10 };

  state.currentItem = { x: 15, y: 15, type: 'food' };
  state.obstacles = [];

  // Já nasce indo para a direita para não embolar nos próprios blocos
  state.inputQueue = [];
  state.currentDirection = { x: 1, y: 0 };
  state.score = 0;
  state.isGameOver = false;
  state.isGameStarted = false;
  state.isPaused = false;

  // Controle de Tempo e Velocidade
  state.speed = 8;
  state.iceEffectExpiration = 0;
  state.fireEffectExpiration = 0;
  state.earthEffectExpiration = 0;
  state.ghostEffectExpiration = 0;
  state.magnetEffectExpiration = 0;
  state.poisonEffectExpiration = 0;
}