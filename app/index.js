import './assets/main.css';
import socket from 'socket.io-client';
import User from './components/lobby/User';
import Menu from './components/menu';
import Lobby from './components/lobby';
import Game from './components/game';


const io = socket.connect(window.location.host, { reconnect: true });

io.on('connect', () => {
  console.log(`Client ${io.io.engine.id} connected to Socket.io.`);

  const user = new User(io);
  user.setupName();

  const menu = new Menu(io, user);
  menu.render();

  const lobby = new Lobby(io, user);
  lobby.render();

  const game = new Game();

  io.on('Game/started', room => {
    lobby.hide();
    game.start(room.players);
  });

  io.on('Game/closed', () => {
    lobby.show();
    game.kill();
  });
});
