import { List, fromJS } from 'immutable';
import {
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  CHANGE_ROOM_STATUS,
  DELETE_ROOM,
} from '../actions';
import Rooms from '../services/Rooms';


const defaultState = new List();

export default function roomReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_ROOM:
      return state.push(fromJS(action.room));
    case JOIN_ROOM:
      return Rooms.updateReducer(state, action);
    case LEAVE_ROOM:
      return Rooms.updateReducer(state, action);
    case CHANGE_ROOM_STATUS:
      return Rooms.updateReducer(state, action);
    case DELETE_ROOM:
      return state.filter(r => r.get('id') !== action.id);
    default:
      return state;
  }
}
