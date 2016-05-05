import { START_GAME } from './actionTypes';

export function startGame(roomId) {
  return {
    type: START_GAME,
    roomId,
  };
}
