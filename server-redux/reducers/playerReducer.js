import { List } from 'immutable';
import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER } from '../API';

const defaultState = new List();

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_PLAYER:
      return state.push(action.player);
    case UPDATE_PLAYER:
      return state.set(action.id, action.player);
    case DELETE_PLAYER:
      return state.filter(player => player.id !== action.id);
    default:
      return state;
  }
}
