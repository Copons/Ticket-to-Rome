import { List, fromJS } from 'immutable';
import { START_GAME } from '../actions/actionTypes';


const defaultState = new List();

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case START_GAME:
      return state.push(fromJS(action.game));
    default:
      return state;
  }
}
