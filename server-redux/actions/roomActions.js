import { CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM, DELETE_ROOM } from '../API';

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
