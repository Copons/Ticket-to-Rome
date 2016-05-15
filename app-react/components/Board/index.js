import React from 'react';
import { Routes } from './Routes';
import { Stations } from './Stations';
import { StationNames } from './StationNames';
import RoutePopup from './RoutePopup';


export const Board = () =>
  <div className="board">
    <svg
      viewBox="0 0 640 360"
      preserveAspectRatio="xMinYMid meet"
    >
      <Routes />
      <Stations />
      <StationNames />
    </svg>
    <RoutePopup />
  </div>;
