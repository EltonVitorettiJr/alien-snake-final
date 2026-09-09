import { resetState, state } from "../states/gameState";

export function setupInput(onRestart: () => void) {
  const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
  const restartBtn = document.getElementById(
    "restart-btn",
  ) as HTMLButtonElement;

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (state.isGameOver || !state.isGameStarted) {
        resetState();
        state.isGameStarted = true;
        onRestart();
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (state.isGameOver || !state.isGameStarted) {
        resetState();
        state.isGameStarted = true;
        onRestart();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if ((state.isGameOver || !state.isGameStarted) && e.key === "Enter") {
      resetState();
      state.isGameStarted = true;
      onRestart();
      return;
    }

    if (e.key === "Escape") {
      if (state.isGameStarted && !state.isGameOver) {
        if (!state.isPaused) {
          state.isPaused = true;
        } else {
          state.isPaused = false;
          state.isGameStarted = false;
          resetState();
        }
      } else if (state.isGameOver) {
        resetState();
        onRestart();
      }
      return;
    }

    if (e.key === " " && state.isPaused) {
      state.isPaused = false;
      return;
    }

    if (state.isPaused) return;

    const lastInput =
      state.inputQueue.length > 0
        ? state.inputQueue[state.inputQueue.length - 1]
        : state.currentDirection;

    const invert = state.poisonEffectExpiration > Date.now() ? -1 : 1;

    switch (e.key) {
      case "w":
      case "ArrowUp":
        if (lastInput.y === 0) state.inputQueue.push({ x: 0, y: -1 * invert });
        break;
      case "s":
      case "ArrowDown":
        if (lastInput.y === 0) state.inputQueue.push({ x: 0, y: 1 * invert });
        break;
      case "a":
      case "ArrowLeft":
        if (lastInput.x === 0) state.inputQueue.push({ x: -1 * invert, y: 0 });
        break;
      case "d":
      case "ArrowRight":
        if (lastInput.x === 0) state.inputQueue.push({ x: 1 * invert, y: 0 });
        break;
    }
  });
}
