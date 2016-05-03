import React from 'react';
import { RoomsTable } from './RoomsTable';
import CreateRoom from './CreateRoom';
import SetPlayer from './SetPlayer';

export const Lobby = () =>
  <section className="lobby">
    <SetPlayer />
    <RoomsTable />
    <CreateRoom />
  </section>;
