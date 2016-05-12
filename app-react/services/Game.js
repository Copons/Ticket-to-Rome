import {
  START_GAME,
  KILL_GAME,
} from '../actions';


class Game {

  // Services

  start() {}




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
