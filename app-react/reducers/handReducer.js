import { Map, fromJS } from 'immutable';
import {
  SET_HAND,
  ADD_CARD,
  ADD_DESTINATION,
  MULTIPLE_ADD_DESTINATION,
} from '../actions';

const defaultState = new Map();

export default function handReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_HAND:
      return new Map(fromJS(action.hand));
    case ADD_CARD:
      return state.setIn(['cards'], state.get('cards').push(fromJS(action.card)));
    case ADD_DESTINATION:
      return state.setIn(
        ['destinations'],
        state.get('destinations').push(fromJS(action.destination))
      );
    case MULTIPLE_ADD_DESTINATION:
      return state.setIn(
        ['destinations'],
        state.get('destinations').push(fromJS(...action.destinations))
      );
    default:
      return state;
  }
}
