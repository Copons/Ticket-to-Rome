import { List, fromJS } from 'immutable';
import { SET_ROOMS } from '../actions/actionTypes';

const defaultState = new List();

export default function roomsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_ROOMS:
      return state.merge(fromJS(action.rooms));
    default:
      return state;
  }
}
