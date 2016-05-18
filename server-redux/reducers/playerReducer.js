import { List, fromJS } from 'immutable';
import {
  CREATE_PLAYER,
  CHANGE_PLAYER_NAME,
  RESET_PLAYER_STATS,
  DELETE_PLAYER,
} from '../actions';
import Players from '../services/Players';


const defaultState = new List();

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_PLAYER:
      return state.push(action.player);
    case CHANGE_PLAYER_NAME:
      return state.set(action.entry[0], action.entry[1].set('name', action.name));
    case RESET_PLAYER_STATS:
      return state.set(action.entry[0], action.entry[1].merge(fromJS(Players.resetStats())));
    case DELETE_PLAYER:
      return state.filter(p => p.get('id') !== action.id);
    default:
      return state;
  }
}
