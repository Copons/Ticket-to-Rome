import { SET_PLAYER } from '../API';

export function setPlayer(player) {
  return {
    type: SET_PLAYER,
    player,
  };
}
