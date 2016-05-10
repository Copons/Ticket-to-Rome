import React from 'react';
import Rooms from './Rooms';
import CreateRoom from './CreateRoom';
import SetPlayer from './SetPlayer';

export const Lobby = () =>
  <section className="lobby">
    <SetPlayer />
    <Rooms />
    <CreateRoom />
  </section>;
