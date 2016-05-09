import { List, fromJS } from 'immutable';
import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER } from '../actions/actionTypes';
import Players from '../services/Players';


const defaultState = new List();

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_PLAYER:
      return state.push(fromJS(action.player));
    case UPDATE_PLAYER:
      return Players.updateReducer(state, action);
    case DELETE_PLAYER:
      return state.filter(p => p.get('id') !== action.id);
    default:
      return state;
  }
}
