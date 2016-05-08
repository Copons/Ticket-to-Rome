import store from '../store';
import Response from './Response';
import Rooms from './Rooms';
import { START_GAME } from '../actions/actionTypes';
import { startGame, changeRoomStatus } from '../actions';
import { findEntryById } from '../helpers/find';

class Games {

  all = () => store.getState().players

  one = id => {
    const player = findEntryById(this.all(), id);
    if (player !== null) {
      return player[1];
    } else {
      return null;
    }
  };

  start = roomId => {
    const room = Rooms.one(roomId);
    if (room) {
      store.dispatch(changeRoomStatus(roomId, 'playing'));
      const action = store.dispatch(startGame({
        room: room.get('id'),
        players: room.get('players'),
      }));
      return Response.success(action.type);
    } else {
      return Response.error(START_GAME);
    }
  }

}

export default new Games();
