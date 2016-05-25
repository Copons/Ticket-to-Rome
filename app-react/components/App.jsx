import React from 'react';
import Game from './Game';
import Lobby from './Lobby';
import Log from './Log';
import { Modal } from './Modal';


export const App = () =>
  <div>
    <Modal />
    <Lobby />
    <Game />
    <Log />
  </div>;
