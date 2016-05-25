import store from '../store';
import IO from '../socket/IO';
import Messages from './Messages';
import {
  SET_ROOMS,
  CREATE_ROOM,
  START_GAME_SETUP,
} from '../actions';

class Rooms {

  // Utilities

  isOpen = room => room.get('status') === 'open';

  isPlayerOwner = (room, player) => room.get('owner').get('id') === player.get('id');

  containsPlayer = (room, player) => {
    const playerFound = room.get('players').find(p => p.get('id') === player.get('id'));
    if (playerFound) return true;
    return false;
  };




  // Services

  onActionButtonClick = (action, room, player) => {
    if (action === START_GAME_SETUP) {
      IO.emit(action, room.get('id'))
        .catch(response => {
          store.dispatch(Messages.addThunk(response));
        });
    } else {
      IO.emit(action, {
        roomId: room.get('id'),
        playerId: player.get('id'),
      })
        .then(response => {
          store.dispatch(Messages.addThunk(response));
        });
    }
  };




  // Actions

  setRoomsAction = rooms => ({
    type: SET_ROOMS,
    rooms,
  });




  // Helpers

  createRoomDispatch = name => (dispatch, getState) => {
    const player = getState().player;
    if (name === '' || !player.has('name')) return;

    IO.emit(CREATE_ROOM, {
      name,
      owner: player.get('id'),
    })
      .then(response => {
        dispatch(Messages.addThunk(response));
      });
  };

}

export default new Rooms();
