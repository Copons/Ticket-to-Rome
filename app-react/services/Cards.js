import IO from '../socket/IO';
import { RULES } from '../config/rules';
import Game from './Game';
import Hand from './Hand';
import Messages from './Messages';
import {
  DRAW_FROM_DECK,
  DRAW_FROM_PILE,
  DRAW_DESTINATION,
  PICK_DESTINATIONS,
} from '../actions';

class Cards {

  // Services

  mapColors = hand => {
    const colors = new Map();
    if (hand.has('cards')) {
      hand.get('cards').forEach(card => {
        const type = card.get('type');
        if (colors.has(type)) {
          colors.set(type, colors.get(type) + 1);
        } else {
          colors.set(type, 1);
        }
      });
    }
    return colors;
  }

  // Helpers

  drawFromDeckThunk = () => (dispatch, getState) => {
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

  drawFromPileThunk = card => (dispatch, getState) => {
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

  drawDestinationThunk = () => (dispatch, getState) => {
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

  pickDestinationsThunk = () => (dispatch, getState) => {
    const playerId = getState().player.get('id');
    const gameId = getState().game.get('id');
    const destinations = getState().ui.get('tmpDestinations');
    IO.emit(PICK_DESTINATIONS, {
      playerId,
      gameId,
      destinations,
    }).then(response => {
      dispatch(Hand.multipleAddDestinationAction(response.payload));
      dispatch(Messages.addThunk(response));
    });
  }

}

export default new Cards();
