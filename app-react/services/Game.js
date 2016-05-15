import store from '../store';
import {
  START_GAME,
  KILL_GAME,
} from '../actions';


class Game {

  // Services

  start = game => {
    const newGame = game;
    newGame.players = newGame.players.map(p => ({
      ...p,
      points: 0,
      cards: 0,
      pieces: 0,
      destinations: 0,
    }));
    store.dispatch(this.startGameAction(newGame));
  }




  // Actions

  startGameAction = game => ({
    type: START_GAME,
    game,
  });

  killGameAction = () => ({
    type: KILL_GAME,
  });




  // Helpers

}

export default new Game();
