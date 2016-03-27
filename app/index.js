import './assets/main.css';
import Game from './components/game';
import io from 'socket.io-client';

const socketIo = io.connect('http://localhost:3000', { reconnect: true });
socketIo.on('connect', () => {
  console.log('socket connected');
});

const game = new Game(1);
console.log(game);
