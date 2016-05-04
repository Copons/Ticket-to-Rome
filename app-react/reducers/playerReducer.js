import { Map, fromJS } from 'immutable';
import { SET_PLAYER } from '../actions/actionTypes';

const defaultState = new Map();

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_PLAYER:
      return state.merge(fromJS(action.player));
    default:
      return state;
  }
}
