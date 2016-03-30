import './assets/main.css';
import socket from 'socket.io-client';
const io = socket.connect(window.location.host, { reconnect: true });

// TESTS START HERE:

import Lobby from './components/lobby';

const lobby = new Lobby(io);
lobby.render();
