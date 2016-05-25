import store from '../store';
import {
  SET_GAME,
  START_GAME_SETUP,
  KILL_GAME,
  SET_TURN_ACTIONS,
} from '../actions';


class Game {

  // Services

  setTurnActions = actions => {
    store.dispatch(this.setTurnActionsAction(store.getState().game.get('actions') + actions));
  }




  // Actions

  setGameAction = game => ({
    type: SET_GAME,
    game,
  });

  startSetupAction = game => ({
    type: START_GAME_SETUP,
    game,
  });

  killGameAction = () => ({
    type: KILL_GAME,
  });

  setTurnActionsAction = actions => ({
    type: SET_TURN_ACTIONS,
    actions,
  });

}

export default new Game();
