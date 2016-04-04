import './assets/main.css';
import IO from './components/communications/IO';
import Menu from './components/menu/Menu';
import Lobby from './components/lobby/Lobby';
import Player from './components/player/Player';
import Game from './components/game/Game';


IO.connect().then(clientId => {
  // Initialize the current player
  Player.init(clientId);

  // Initialize the basic layout components
  new Menu();
  const lobby = new Lobby();
  lobby.show();

  // Initialize the game, waiting to start
  new Game();
});
