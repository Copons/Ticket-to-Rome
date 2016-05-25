import { List, fromJS } from 'immutable';
import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
} from '../actions';

const defaultState = new List();

export default function messagesReducer(state = defaultState, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return state.unshift(fromJS(action.message));
    case REMOVE_MESSAGE:
      return state.pop();
    default:
      return state;
  }
}
