import React from 'react';
import { Routes } from './Routes';
import { Stations } from './Stations';
import { StationNames } from './StationNames';


export const Board = () =>
  <div className="board">
    <svg viewBox="0 0 640 360">
      <Routes />
      <Stations />
      <StationNames />
    </svg>
  </div>;
