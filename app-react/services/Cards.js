import IO from '../socket/IO';
import { RULES } from '../config/rules';
import Game from './Game';
import Hand from './Hand';
import Messages from './Messages';
import {
  DRAW_FROM_DECK,
  DRAW_FROM_PILE,
  DRAW_DESTINATION,
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
        Game.setTurnActions(RULES.action.drawFromDeck);
        dispatch(Hand.addCardAction(response.payload));
        dispatch(Messages.addThunk(response));
      });
  };

  drawFromPileDispatch = card => (dispatch, getState) => {
    const playerId = getState().player.get('id');
    const gameId = getState().game.get('id');
    IO.emit(DRAW_FROM_PILE, {
      playerId,
      gameId,
      card,
    })
      .then(response => {
        if (card.get('type') === 'wild') {
          Game.setTurnActions(RULES.action.drawWildFromPile);
        } else {
          Game.setTurnActions(RULES.action.drawFromPile);
        }
        dispatch(Hand.addCardAction(response.payload));
        dispatch(Messages.addThunk(response));
      });
  };

  drawDestinationDispatch = () => (dispatch, getState) => {
    const playerId = getState().player.get('id');
    const gameId = getState().game.get('id');
    IO.emit(DRAW_DESTINATION, {
      playerId,
      gameId,
    })
      .then(response => {
        Game.setTurnActions(RULES.action.newDestination);
        dispatch(Hand.addDestinationAction(response.payload));
        dispatch(Messages.addThunk(response));
      });
  };

}

export default new Cards();
