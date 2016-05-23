import IO from '../socket/IO';
import Hand from './Hand';
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
        dispatch(Hand.addCardAction(response.payload));
        dispatch(Messages.addThunk(response));
      });
  };

}

export default new Cards();
