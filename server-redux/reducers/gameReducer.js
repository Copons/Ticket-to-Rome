import { List, fromJS } from 'immutable';
import {
  START_GAME,
  KILL_GAME,
} from '../actions';


const defaultState = new List();

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case START_GAME:
      return state.push(fromJS(action.room));
    case KILL_GAME:
      return state.filter(g => g.get('id') !== action.id);
    default:
      return state;
  }
}
