import React from 'react';
import { Player } from './Player';
import { Turn } from './Turn';


export const InfoBar = () =>
  <nav className="info-bar">
    <Turn />
    <Player />
    <Player />
    <Player />
  </nav>;
