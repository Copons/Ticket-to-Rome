import { List } from 'immutable';
import store from '../store';
import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
  HIGHLIGHT_STATIONS,
  ADD_TMP_DESTINATION,
  REMOVE_TMP_DESTINATION,
  EMPTY_TMP_DESTINATIONS,
} from '../actions';


class UI {

  // Services

  addTmpDestination = destination => {
    const tmpDestinations = store.getState().ui.get('tmpDestinations') || new List();
    store.dispatch(this.addTmpDestinationAction(tmpDestinations.push(destination)));
  }

  removeTmpDestination = destination => {
    const tmpDestinations = store.getState().ui.get('tmpDestinations');
    const destinationIndex = tmpDestinations.findKey(d => d === destination);
    store.dispatch(this.removeTmpDestinationAction(destinationIndex));
  }




  // Actions

  openRoutePopupAction = routeInfo => ({
    type: OPEN_ROUTE_POPUP,
    routeInfo,
  });

  closeRoutePopupAction = () => ({
    type: CLOSE_ROUTE_POPUP,
  });

  highlightStationsAction = stations => ({
    type: HIGHLIGHT_STATIONS,
    stations,
  })

  addTmpDestinationAction = destination => ({
    type: ADD_TMP_DESTINATION,
    destination,
  });

  removeTmpDestinationAction = destinationIndex => ({
    type: REMOVE_TMP_DESTINATION,
    destinationIndex,
  });

  emptyTmpDestinationsAction = () => ({
    type: EMPTY_TMP_DESTINATIONS,
  });




  // Helpers

  toggleRoutePopupThunk = routeInfo => dispatch => {
    if (store.getState().ui.has('routePopup')) {
      dispatch(this.closeRoutePopupAction());
    }
    if (routeInfo) {
      dispatch(this.openRoutePopupAction(routeInfo));
    }
  };

}

export default new UI();
