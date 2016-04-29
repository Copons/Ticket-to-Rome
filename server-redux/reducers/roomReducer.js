import { List, fromJS } from 'immutable';
import { CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM, DELETE_ROOM } from '../API';
import { findEntryById } from '../helpers/find';


function updateRoom(state, action) {
  const room = findEntryById(state, action.roomId);
  if (room[0] !== null) {
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


const defaultState = new List();

export default function roomReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_ROOM:
      return state.push(fromJS(action.room));
    case JOIN_ROOM:
      return updateRoom(state, action);
    case LEAVE_ROOM:
      return updateRoom(state, action);
    case DELETE_ROOM:
      return state.filter(r => r.get('id') !== action.id);
    default:
      return state;
  }
}
