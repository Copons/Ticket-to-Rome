import uuid from 'node-uuid';
import IO from '../socket/IO';
import Messages from './Messages';
import {
  SET_PLAYER,
  CREATE_PLAYER,
  UPDATE_PLAYER,
} from '../actions';


class Player {


  // Actions

  setPlayerAction = player => ({
    type: SET_PLAYER,
    player,
  });




  // Helpers

  setPlayerDispatch = name => (dispatch, getState) => {
    let action;
    let player;
    if (getState().player.has('name')) {
      action = UPDATE_PLAYER;
      player = {
        ...getState().player.toJS(),
        name,
      };
    } else {
      action = CREATE_PLAYER;
      player = {
        ...getState().player.toJS(),
        id: uuid.v4(),
        name,
      };
    }

    IO.emit(action, player)
      .then(response => {
        dispatch(this.setPlayerAction(player));
        dispatch(Messages.addThunk(response));
      });
  };

}

export default new Player();
