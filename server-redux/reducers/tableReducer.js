import { List } from 'immutable';
import {
  CREATE_TABLE,
  DELETE_TABLE,
  CREATE_DECK,
  REMOVE_FROM_DECK,
  MULTIPLE_REMOVE_FROM_DECK,
  ADD_TO_PILE,
  REMOVE_FROM_PILE,
} from '../actions';
import Cards from '../services/Cards';


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
    case REMOVE_FROM_DECK:
      return state.deleteIn([action.tableIndex, 'deck', action.cardIndex]);
    case MULTIPLE_REMOVE_FROM_DECK:
      return Cards.multipleRemoveFromDeckReducer(state, action);
    case ADD_TO_PILE:
      return Cards.addToPileReducer(state, action);
    case REMOVE_FROM_PILE:
      return state.deleteIn([action.tableIndex, 'pile', action.cardIndex]);
    case DELETE_TABLE:
      return state.delete(action.index);
    default:
      return state;
  }
}
