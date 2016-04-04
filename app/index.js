import './assets/main.css';
import IO from './components/communications/IO';
import Menu from './components/menu/Menu';
import Lobby from './components/lobby/Lobby';
import Player from './components/player/Player';


IO.connect().then(clientId => {
  Player.init(clientId);

  // Initialize the basic layout components
  new Menu();
  new Lobby();
});
