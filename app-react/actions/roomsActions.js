import { SET_ROOMS } from './actionTypes';

export function setRooms(rooms) {
  return {
    type: SET_ROOMS,
    rooms,
  };
}
