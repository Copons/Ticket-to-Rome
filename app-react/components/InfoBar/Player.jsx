import React from 'react';
import { PlayerInfo } from './PlayerInfo';


export const Player = () =>
  <div className="player">
    <div className="name">
      Player Name
    </div>
    <div className="info">
      <PlayerInfo type="points" />
      <PlayerInfo type="cards" />
      <PlayerInfo type="pieces" />
      <PlayerInfo type="destinations" />
    </div>
  </div>;
