import { Map, fromJS } from 'immutable';
import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
} from '../actions';

const defaultState = new Map();

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case OPEN_ROUTE_POPUP:
      return state.set('routePopup', fromJS(action.route));
    case CLOSE_ROUTE_POPUP:
      return state.remove('routePopup');
    default:
      return state;
  }
}
