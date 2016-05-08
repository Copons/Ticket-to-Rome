import { START_GAME } from './actionTypes';

export function startGame(game) {
  return {
    type: START_GAME,
    game,
  };
}
