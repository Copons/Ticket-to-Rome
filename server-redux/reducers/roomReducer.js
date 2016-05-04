import { List, fromJS } from 'immutable';
import {
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  DELETE_ROOM,
  UPDATE_PLAYER_IN_ROOMS,
} from '../actions/actionTypes';
import Rooms from '../components/Rooms';


const defaultState = new List();

export default function roomReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_ROOM:
      return state.push(fromJS(action.room));
    case JOIN_ROOM:
      return Rooms.updateReducer(state, action);
    case LEAVE_ROOM:
      return Rooms.updateReducer(state, action);
    case DELETE_ROOM:
      return state.filter(r => r.get('id') !== action.id);
    case UPDATE_PLAYER_IN_ROOMS:
      return Rooms.updatePlayerReducer(state, action);
    default:
      return state;
  }
}
