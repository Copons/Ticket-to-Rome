import { List, Map, fromJS } from 'immutable';
import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
  HIGHLIGHT_STATIONS,
  ADD_TMP_DESTINATION,
  REMOVE_TMP_DESTINATION,
  EMPTY_TMP_DESTINATIONS,
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
    case ADD_TMP_DESTINATION:
      return state.set('tmpDestinations', action.destination);
    case REMOVE_TMP_DESTINATION:
      return state.deleteIn(['tmpDestinations', action.destinationIndex]);
    case EMPTY_TMP_DESTINATIONS:
      return state.set('tmpDestinations', new List());
    default:
      return state;
  }
}
