import { Map, fromJS } from 'immutable';
import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
  HIGHLIGHT_STATIONS,
} from '../actions';

const defaultState = new Map();

export default function uiReducer(state = defaultState, action) {
  switch (action.type) {
    case OPEN_ROUTE_POPUP:
      return state.set('routePopup', fromJS(action.routeInfo));
    case CLOSE_ROUTE_POPUP:
      return state.remove('routePopup');
    case HIGHLIGHT_STATIONS:
      return state.set('stationsHighlight', fromJS(action.stations));
    default:
      return state;
  }
}
