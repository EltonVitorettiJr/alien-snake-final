export type ItemType = 'food' | 'extra_points' | 'earth_fruit' | 'ice_fruit' | 'fire_fruit';

export const state = {
  snake: [{ x: 10, y: 10 }],
  currentItem: { x: 15, y: 15, type: 'food' as ItemType },
  obstacles: [] as { x: number; y: number; expiresAt: number }[],

  inputQueue: [] as { x: number; y: number }[],
  currentDirection: { x: 0, y: 0 },
  score: 0,
  isGameOver: false,
  isGameStarted: false,
  isPaused: false,

  // Controle de Tempo e Velocidade
  lastTime: 0,
  speed: 8,
  iceEffectExpiration: 0,
  fireEffectExpiration: 0,
  earthEffectExpiration: 0,
};

export function resetState() {
  state.snake = [{ x: 10, y: 10 }];
  state.currentItem = { x: 15, y: 15, type: 'food' };
  state.obstacles = [];
  state.inputQueue = [];
  state.currentDirection = { x: 0, y: 0 };
  state.score = 0;
  state.isGameOver = false;
  state.isGameStarted = false;
  state.isPaused = false;

  // Controle de Tempo e Velocidade
  state.speed = 8;
  state.iceEffectExpiration = 0;
  state.fireEffectExpiration = 0;
}