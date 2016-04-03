import './assets/main.css';
import IO from './components/communications/IO';
import Menu from './components/menu/Menu';
import Player from './components/player/Player';


IO.connect().then(clientId => {
  // Initialize the basic layout components
  new Menu();

  // Initialize the current player
  new Player(clientId);
});
