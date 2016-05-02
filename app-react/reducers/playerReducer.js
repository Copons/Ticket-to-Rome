import { Map, fromJS } from 'immutable';
import { CREATE_PLAYER, UPDATE_PLAYER } from '../API';

const defaultState = new Map();

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_PLAYER:
      return state.merge(fromJS(action.player));
    case UPDATE_PLAYER:
      return state.merge(fromJS(action.player));
    default:
      return state;
  }
}
