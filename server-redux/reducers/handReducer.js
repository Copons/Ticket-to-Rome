import { List, fromJS } from 'immutable';
import {
  CREATE_HAND,
  DELETE_HAND,
  RESET_HAND,
  DRAW_FROM_DECK,
  MULTIPLE_DRAW_FROM_DECK,
  DRAW_FROM_PILE,
  DRAW_DESTINATION,
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
      return state.setIn(
        [action.entry[0], 'cards'],
        action.entry[1].get('cards').push(action.card)
      );

    case MULTIPLE_DRAW_FROM_DECK:
      return Hands.multipleDrawFromDeckReducer(state, action);

    case DRAW_FROM_PILE:
      return state.setIn(
        [action.entry[0], 'cards'],
        action.entry[1].get('cards').push(action.card)
      );

    case DRAW_DESTINATION:
      return state.setIn(
        [action.entry[0], 'destinations'],
        action.entry[1].get('destinations').push(action.destination)
      );

    default:
      return state;

  }
}
