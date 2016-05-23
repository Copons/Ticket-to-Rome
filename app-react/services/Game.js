import {
  SET_GAME,
  START_GAME,
  KILL_GAME,
} from '../actions';


class Game {

  // Actions

  setGameAction = game => ({
    type: SET_GAME,
    game,
  });

  startGameAction = game => ({
    type: START_GAME,
    game,
  });

  killGameAction = () => ({
    type: KILL_GAME,
  });

}

export default new Game();
