import IO from '../socket/IO';
import Messages from './Messages';
import {
  SET_PLAYER,
  CREATE_PLAYER,
  CHANGE_PLAYER_NAME,
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
    let payload;
    const player = getState().player;
    if (player.has('name')) {
      action = CHANGE_PLAYER_NAME;
      payload = {
        name,
        id: player.get('id'),
      };
    } else {
      action = CREATE_PLAYER;
      payload = {
        name,
        client: player.get('client'),
      };
    }

    IO.emit(action, payload)
      .then(response => {
        dispatch(this.setPlayerAction(response.payload));
        dispatch(Messages.addThunk(response));
      });
  };

}

export default new Player();
