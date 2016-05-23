import store from '../store';
import IO from './IO';
import {
  SET_ROOMS,
  SET_GAME,
  START_GAME,
  KILL_GAME,
  SET_TABLE,
  ALL_HANDS_IN_GAME,
} from '../actions';
import Game from '../services/Game';
import Hand from '../services/Hand';
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

IO.on(SET_GAME, response => {
  store.dispatch(Game.setGameAction(response.payload));
});

IO.on(SET_TABLE, response => {
  console.log(response.payload);
  store.dispatch(Table.setTableAction(response.payload));
});

IO.on(ALL_HANDS_IN_GAME, response => {
  const hand = Hand.findPlayerHand(response.payload);
  //console.log(hand);
  store.dispatch(Hand.setHandAction(hand));
});
