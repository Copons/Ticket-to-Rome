import { List, fromJS } from 'immutable';
import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER } from '../API';


function findAndUpdatePlayer(state, action) {
  const player = state.findEntry(p => p.get('id') === action.id);
  if (player[0] > -1) {
    return state.set(player[0], player[1].merge(fromJS(action.player)));
  } else {
    return state;
  }
}


const defaultState = new List();

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_PLAYER:
      return state.push(fromJS(action.player));
    case UPDATE_PLAYER:
      return findAndUpdatePlayer(state, action);
    case DELETE_PLAYER:
      return state.filter(p => p.get('id') !== action.id);
    default:
      return state;
  }
}
