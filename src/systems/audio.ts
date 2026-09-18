import eatFruitAudio from '../audio/eat_fruit.mp3';
import extraPointsAudio from '../audio/extra_points.mp3';
import gameOverAudio from '../audio/game_over.mp3';

// Cria os objetos de áudio do HTML5
const eatFruitSound = new Audio(eatFruitAudio);
eatFruitSound.volume = 0.1;

const extraPointsSound = new Audio(extraPointsAudio);
extraPointsSound.volume = 0.6;

const gameOverSound = new Audio(gameOverAudio);
gameOverSound.volume = 0.05;

// Função exportada para tocar os sons
export function playSound(type: 'eat' | 'extra' | 'gameover') {
  try {
    let sound: HTMLAudioElement;

    if (type === 'eat') sound = eatFruitSound;
    else if (type === 'extra') sound = extraPointsSound;
    else sound = gameOverSound;

    // Resetar o tempo para 0 permite que o som toque várias vezes 
    // muito rápido (útil quando você come várias maçãs seguidas)
    sound.currentTime = 0;
    sound.play();
  } catch (error) {
    // Navegadores às vezes bloqueiam áudio se o usuário não interagiu com a tela ainda
    console.warn("Áudio bloqueado pelo navegador", error);
  }
}