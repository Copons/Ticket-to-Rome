import store from '../store';
import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
} from '../actions';


class UI {

  // Services




  // Actions

  openRoutePopupAction = route => ({
    type: OPEN_ROUTE_POPUP,
    route,
  });

  closeRoutePopupAction = () => ({
    type: CLOSE_ROUTE_POPUP,
  });




  // Helpers

  toggleRoutePopupThunk = route => dispatch => {
    dispatch(this.closeRoutePopupAction());
    if (route) {
      dispatch(this.openRoutePopupAction(route));
    }
  };

}

export default new UI();
