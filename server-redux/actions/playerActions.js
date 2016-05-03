import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER } from '../API';

export function createPlayer(player) {
  return {
    type: CREATE_PLAYER,
    player,
  };
}

export function updatePlayer(player) {
  return {
    type: UPDATE_PLAYER,
    player,
  };
}

export function deletePlayer(id) {
  return {
    type: DELETE_PLAYER,
    id,
  };
}
