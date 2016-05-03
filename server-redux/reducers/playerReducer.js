import { List, fromJS } from 'immutable';
import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER } from '../API';
import { findEntryById } from '../helpers/find';


function updatePlayer(state, action) {
  const player = findEntryById(state, action.player.id);
  if (player !== null) {
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
      return updatePlayer(state, action);
    case DELETE_PLAYER:
      return state.filter(p => p.get('id') !== action.id);
    default:
      return state;
  }
}
