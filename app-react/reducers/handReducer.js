import { Map, fromJS } from 'immutable';
import { SET_HAND } from '../actions';

const defaultState = new Map();

export default function handReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_HAND:
      return new Map(fromJS(action.hand));
    default:
      return state;
  }
}
