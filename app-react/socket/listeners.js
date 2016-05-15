import store from '../store';
import IO from './IO';
import {
  SET_ROOMS,
  START_GAME,
  KILL_GAME,
} from '../actions';
import Game from '../services/Game';
import Messages from '../services/Messages';
import Rooms from '../services/Rooms';


IO.on(SET_ROOMS, response => {
  store.dispatch(Rooms.setRoomsAction(response.body));
});

IO.on(START_GAME, response => {
  store.dispatch(Game.startGameAction(response.body));
  store.dispatch(Messages.addThunk(response));
});

IO.on(KILL_GAME, response => {
  store.dispatch(Game.killGameAction());
  store.dispatch(Messages.addThunk(response));
});
