import store from '../store';
import IO from './IO';
import { SET_ROOMS } from '../actions';
import Rooms from '../services/Rooms';


IO.on(SET_ROOMS, response => {
  store.dispatch(Rooms.setRoomsAction(response.body));
});
