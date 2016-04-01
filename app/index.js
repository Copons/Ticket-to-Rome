import './assets/main.css';
import socket from 'socket.io-client';
import PubSub from './libs/PubSub';
import User from './components/lobby/User';
//import Menu from './components/menu';
//import Lobby from './components/lobby';
import Game from './components/game';


const io = socket.connect(window.location.host, { reconnect: true });

io.on('connect', () => {
  console.log(`Client ${io.io.engine.id} connected to Socket.io.`);

  const user = new User(io);
  user.setupName();

  // Jumps directly to a single player game
  user.name = `Copons-${user.id}`;
  PubSub.pub('User/name', user.name);
  const room = {
    id: user.id,
    name: 'Test Room',
    players: [{
      id: user.id,
      name: user.name,
    }],
  };
  io.emit('Game/debug', room);
  const game = new Game(io, room);
  io.on('Game/started', newGame => {
    console.log(newGame);
    game.start(newGame);
  });

  /*
  const menu = new Menu(io, user);
  menu.render();

  const lobby = new Lobby(io, user);
  lobby.render();

  const game = new Game();

  io.on('Game/started', newGame => {
    lobby.hide();
    game.start(newGame);
  });

  io.on('Game/closed', () => {
    lobby.show();
    game.kill();
  });
  */
});
