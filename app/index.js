import './assets/main.css';
import socket from 'socket.io-client';
import User from './components/player/User';
import Menu from './components/menu';
import Lobby from './components/lobby';


const io = socket.connect(window.location.host, { reconnect: true });

io.on('connect', () => {
  console.log(`Client ${io.io.engine.id} connected to Socket.io.`);

  const user = new User(io);
  user.setupName();

  const menu = new Menu();
  menu.render();

  const lobby = new Lobby(io, user);
  lobby.render();
});
