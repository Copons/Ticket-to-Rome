import {
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  DELETE_ROOM,
  UPDATE_PLAYER_IN_ROOMS,
 } from '../API';

export function createRoom(room) {
  return {
    type: CREATE_ROOM,
    room,
  };
}

export function joinRoom(roomId, playerId) {
  return {
    type: JOIN_ROOM,
    roomId,
    playerId,
  };
}

export function leaveRoom(roomId, playerId) {
  return {
    type: LEAVE_ROOM,
    roomId,
    playerId,
  };
}

export function deleteRoom(id) {
  return {
    type: DELETE_ROOM,
    id,
  };
}

export function updatePlayerInRooms(player) {
  return {
    type: UPDATE_PLAYER_IN_ROOMS,
    player,
  };
}
