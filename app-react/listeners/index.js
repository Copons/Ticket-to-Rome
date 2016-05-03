import store from '../store';
import { io } from '../libs/io';
import { SET_ROOMS } from '../API';
import { setRooms } from '../actions';

io.on(SET_ROOMS, response => {
  store.dispatch(setRooms(response.body));
});
