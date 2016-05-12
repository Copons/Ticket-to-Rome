import store from '../store';
import Response from './Response';
import Rooms from './Rooms';
import {
  START_GAME,
  KILL_GAME,
} from '../actions';


class Games {


  // Utilities

  all = () => store.getState().games;

  one = id => this.all().find(g => g.get('id') === id);


  emitStart = (room, io) => {
    const response = Response.success(
      `Game started in room ${room.get('name')}.`,
      Rooms.humanizeOne(room)
    );
    io.in(room.get('id')).emit(START_GAME, response);
    return response;
  }


  emitKill = (roomId, io) => {
    console.log(roomId);
    const response = Response.success('Game closed.', roomId);
    io.in(roomId).emit(KILL_GAME, response);
    return response;
  }




  // Services

  start = roomId => new Promise((resolve, reject) => {
    const room = Rooms.one(roomId);
    if (!room) {
      reject(Response.error('Error in starting a game.'));
    } else {
      store.dispatch(this.startThunk(room));
      resolve(room);
    }
  });


  kill = gameId => new Promise(resolve => {
    console.log(gameId);
    store.dispatch(this.killThunk(gameId));
    resolve(gameId);
  });




  // Actions

  startGameAction = room => ({
    type: START_GAME,
    room,
  });

  killGameAction = id => ({
    type: KILL_GAME,
    id,
  });



  // Helpers

  startThunk = room => dispatch => {
    dispatch(Rooms.changeRoomStatusAction(room.get('id'), 'playing'));
    dispatch(this.startGameAction(room));
  };

  killThunk = gameId => dispatch => {
    dispatch(Rooms.changeRoomStatusAction(gameId, 'open'));
    dispatch(this.killGameAction(gameId));
  }

}

export default new Games();
