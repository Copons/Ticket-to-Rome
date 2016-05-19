import store from '../store';
import IO from './IO';
import {
  SET_ROOMS,
  START_GAME,
  KILL_GAME,
  SET_TABLE,
} from '../actions';
import Game from '../services/Game';
import Messages from '../services/Messages';
import Rooms from '../services/Rooms';
import Table from '../services/Table';


IO.on(SET_ROOMS, response => {
  store.dispatch(Rooms.setRoomsAction(response.payload));
});

IO.on(START_GAME, response => {
  store.dispatch(Game.startGameAction(response.payload));
  store.dispatch(Messages.addThunk(response));
});

IO.on(KILL_GAME, response => {
  store.dispatch(Game.killGameAction());
  store.dispatch(Messages.addThunk(response));
});

IO.on(SET_TABLE, response => {
  console.log(response);
  store.dispatch(Table.setTableAction(response.payload));
});
