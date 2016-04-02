import './assets/main.css';
import IO from './components/communications/IO';
import Player from './components/player/Player';


IO.connect().then(clientId => {
  const player = new Player(clientId);
  console.log(player.simplify());
});
