import { SET_PLAYER } from './actionTypes';

export function setPlayer(player) {
  return {
    type: SET_PLAYER,
    player,
  };
}
