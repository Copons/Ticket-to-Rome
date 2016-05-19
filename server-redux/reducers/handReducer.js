import { List, fromJS } from 'immutable';
import {
  CREATE_HAND,
  DELETE_HAND,
  RESET_HAND,
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
    default:
      return state;
  }
}
