import IO from '../socket/IO';
import Messages from './Messages';
import {
  DRAW_FROM_DECK,
} from '../actions';

class Cards {

  // Helpers

  drawFromDeckDispatch = () => (dispatch, getState) => {
    const playerId = getState().player.get('id');
    const gameId = getState().game.get('id');
    IO.emit(DRAW_FROM_DECK, {
      playerId,
      gameId,
    })
      .then(response => {
        dispatch(Messages.addThunk(response));
      });
  };

}

export default new Cards();
