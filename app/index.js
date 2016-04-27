import './assets/main.css';
import IO from './components/communications/IO';
import Game from './components/game/Game';
import Lobby from './components/lobby/Lobby';
import Menu from './components/menu/Menu';
import Player from './components/player/Player';

import Endgame from './components/endgame/Endgame';


IO.connect().then(clientId => {
  // Initialize the current player
  Player.init(clientId);

  // Initialize the basic layout components
  Menu.listen();
  Lobby.listen();
  Lobby.show();

  // Initialize the game, waiting to start
  Game.listen();
  //Game.debugBoard();

  const endgame = new Endgame();
  endgame.render();
  endgame.score.theWinnerIs();
});
