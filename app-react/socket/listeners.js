import store from '../store';
import IO from './IO';
import { SET_ROOMS } from '../actions/actionTypes';
import { setRooms } from '../actions';

IO.on(SET_ROOMS, response => {
  store.dispatch(setRooms(response.body));
});
