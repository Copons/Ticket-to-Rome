import { List, fromJS } from 'immutable';
import { SET_ROOMS } from '../actions';

const defaultState = new List();

export default function roomsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_ROOMS:
      return new List(fromJS(action.rooms));
    default:
      return state;
  }
}
