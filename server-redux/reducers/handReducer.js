import { List, fromJS } from 'immutable';
import {
  CREATE_HAND,
  DELETE_HAND,
  RESET_HAND,
  DRAW_FROM_DECK,
} from '../actions';
import Hands from '../services/Hands';


const defaultState = new List();

export default function handReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_HAND:
      return state.push(action.hand);
    case DELETE_HAND:
      return state.delete(action.index);
    case RESET_HAND:
      return state.set(action.entry[0], action.entry[1].merge(fromJS(Hands.resetHand())));
    case DRAW_FROM_DECK:
      return state.setIn([action.hand[0], 'cards'], action.hand[1].get('cards').push(action.card));
    default:
      return state;
  }
}