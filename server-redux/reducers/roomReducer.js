import { List, fromJS } from 'immutable';
import store from '../store';
import { findEntryById } from '../helpers/find';
import {
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  DELETE_ROOM,
  UPDATE_PLAYER_IN_ROOMS,
 } from '../API';


function createRoom(state, action) {
  const owner = findEntryById(store.getState().players, action.room.owner);
  if (owner[0] !== null) {
    return state.push(fromJS({
      ...action.room,
      owner: owner[1],
    }));
  } else {
    return state;
  }
}

function updateRoom(state, action) {
  const room = findEntryById(state, action.roomId);
  if (room !== null) {
    switch (action.type) {
      case JOIN_ROOM:
        return state.set(
          room[0],
          room[1].merge({ players: room[1].get('players').push(action.playerId) })
        );
      case LEAVE_ROOM:
        return state.set(
          room[0],
          room[1].merge({ players: room[1].get('players').filter(p => p !== action.playerId) })
        );
      default:
        return state;
    }
  } else {
    return state;
  }
}

function updatePlayerInRooms(state, action) {
  const player = findEntryById(store.getState().players, action.player.id);
  if (player !== null) {
    return state.map(room => {
      if (room.get('owner').get('id') === player[1].get('id')) {
        return room.merge({ owner: player[1] });
      } else {
        return room;
      }
    });
  } else {
    return state;
  }
}


const defaultState = new List();

export default function roomReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_ROOM:
      return createRoom(state, action);
    case JOIN_ROOM:
      return updateRoom(state, action);
    case LEAVE_ROOM:
      return updateRoom(state, action);
    case DELETE_ROOM:
      return state.filter(r => r.get('id') !== action.id);
    case UPDATE_PLAYER_IN_ROOMS:
      return updatePlayerInRooms(state, action);
    default:
      return state;
  }
}
