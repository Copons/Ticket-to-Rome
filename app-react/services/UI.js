import {
  OPEN_ROUTE_POPUP,
  CLOSE_ROUTE_POPUP,
} from '../actions';


class UI {

  // Services




  // Actions

  openRoutePopupAction = routeInfo => ({
    type: OPEN_ROUTE_POPUP,
    routeInfo,
  });

  closeRoutePopupAction = () => ({
    type: CLOSE_ROUTE_POPUP,
  });




  // Helpers

  toggleRoutePopupThunk = routeInfo => dispatch => {
    dispatch(this.closeRoutePopupAction());
    if (routeInfo) {
      dispatch(this.openRoutePopupAction(routeInfo));
    }
  };

}

export default new UI();
