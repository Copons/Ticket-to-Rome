import store from '../store';
import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
  HIGHLIGHT_STATIONS,
} from '../actions';


class UI {

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
