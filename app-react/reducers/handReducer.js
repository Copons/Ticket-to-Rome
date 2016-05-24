import { Map, fromJS } from 'immutable';
import {
  SET_HAND,
  ADD_CARD,
} from '../actions';

const defaultState = new Map();

export default function handReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_HAND:
      return new Map(fromJS(action.hand));
    case ADD_CARD:
      return state.setIn(['cards'], state.get('cards').push(fromJS(action.card)));
    default:
      return state;
  }
}
