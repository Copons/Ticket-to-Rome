import { List } from 'immutable';
import {
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  CHANGE_ROOM_STATUS,
  DELETE_ROOM,
} from '../actions';


const defaultState = new List();

export default function roomReducer(state = defaultState, action) {
  switch (action.type) {

    case CREATE_ROOM:
      return state.push(action.room);

    case JOIN_ROOM:
      return state.set(
        action.entry[0],
        action.entry[1].set(
          'players',
          action.entry[1].get('players').push(action.playerId)
        )
      );

    case LEAVE_ROOM:
      return state.set(
        action.entry[0],
        action.entry[1].set(
          'players',
          action.entry[1].get('players').filter(p => p !== action.playerId)
        )
      );

    case CHANGE_ROOM_STATUS:
      return state.set(action.entry[0], action.entry[1].set('status', action.status));

    case DELETE_ROOM:
      return state.delete(action.index);

    default:
      return state;

  }
}
