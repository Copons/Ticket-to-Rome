import { Map, fromJS } from 'immutable';
import { SET_TABLE } from '../actions';

const defaultState = new Map();

export default function tableReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_TABLE:
      return new Map(fromJS(action.table));
    default:
      return state;
  }
}
