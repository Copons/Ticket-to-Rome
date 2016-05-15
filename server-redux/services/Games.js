import store from '../store';
import Players from './Players';
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


  emitStart = (game, io) => {
    const response = Response.success(`Game started in room ${game.get('name')}.`, game);
    io.in(game.get('id')).emit(START_GAME, response);
    return response;
  }


  emitKill = (gameId, io) => {
    const response = Response.success('Game closed.', gameId);
    io.in(gameId).emit(KILL_GAME, response);
    return response;
  }




  // Services

  start = roomId => new Promise((resolve, reject) => {
    const room = Rooms.one(roomId);
    if (!room) {
      reject(Response.error('Error in starting a game.'));
    } else {
      const game = room
        .delete('status')
        .set('turn', 0)
        .set('players', room.get('players').map(p => ({
          ...p,
          points: 0,
          cards: 0,
          pieces: 0,
          destinations: 0,
        })));
      store.dispatch(this.startThunk(game));
      resolve(game);
    }
  });


  kill = gameId => new Promise(resolve => {
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

  startThunk = game => dispatch => {
    dispatch(Rooms.changeRoomStatusAction(game.get('id'), 'playing'));
    dispatch(this.startGameAction(game));
  };

  killThunk = gameId => dispatch => {
    dispatch(Rooms.changeRoomStatusAction(gameId, 'open'));
    dispatch(this.killGameAction(gameId));
  }

}

export default new Games();
