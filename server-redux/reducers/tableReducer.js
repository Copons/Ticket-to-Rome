import { List } from 'immutable';
import {
  CREATE_TABLE,
  DELETE_TABLE,
  CREATE_DECK,
  DRAW_FROM_DECK,
} from '../actions';


const defaultState = new List();

export default function tableReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_TABLE:
      return state.push(action.table);
    case CREATE_DECK:
      return state.set(
        action.entry[0],
        action.entry[1].set('deck', action.deck)
      );
    case DRAW_FROM_DECK:
      return state.deleteIn([action.table[0], 'deck', action.cardIndex]);
    case DELETE_TABLE:
      return state.delete(action.index);
    default:
      return state;
  }
}
