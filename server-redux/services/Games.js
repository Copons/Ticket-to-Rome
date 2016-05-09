import store from '../store';
import Response from './Response';
import Rooms from './Rooms';
import { START_GAME } from '../actions/actionTypes';
import { startGame, changeRoomStatus } from '../actions';


class Games {

  all = () => store.getState().games;

  one = id => this.all().find(g => g.get('id') === id);


  start = roomId => {
    const room = Rooms.one(roomId);
    if (!room) Response.error(START_GAME);

    store.dispatch(changeRoomStatus(roomId, 'playing'));
    const action = store.dispatch(startGame({
      room: room.get('id'),
      players: room.get('players'),
    }));
    return Response.success(action.type);
  }

}

export default new Games();
