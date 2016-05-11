import store from '../store';
import Response from './Response';
import Rooms from './Rooms';
import {
  START_GAME,
} from '../actions';


class Games {


  // Utilities

  all = () => store.getState().games;

  one = id => this.all().find(g => g.get('id') === id);




  // Services

  start = roomId => new Promise((resolve, reject) => {
    const room = Rooms.one(roomId);
    if (!room) {
      reject(Response.error('Error in starting a game.'));
    } else {
      store.dispatch(this.startThunk(room));
      resolve(Response.success('Started a game.'));
    }
  });



  // Actions

  startGameAction = room => ({
    type: START_GAME,
    room,
  });



  // Helpers

  startThunk = room => dispatch => {
    dispatch(Rooms.changeRoomStatusAction(room.get('id'), 'playing'));
    dispatch(this.startGameAction(room));
  };

}

export default new Games();
