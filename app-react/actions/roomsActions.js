import { SET_ROOMS } from '../API';

export function setRooms(rooms) {
  return {
    type: SET_ROOMS,
    rooms,
  };
}
