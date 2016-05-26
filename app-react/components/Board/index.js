import React from 'react';
import { STATIONS } from '../../config/stations';
import { Routes } from './Routes';
import { Station } from './Station';
import { StationName } from './StationName';
import RoutePopup from './RoutePopup';


export const Board = () =>
  <div className="board">
    <svg
      viewBox="0 0 640 360"
      preserveAspectRatio="xMinYMid meet"
    >
      <Routes />
      <g className="stations">
        {STATIONS.map((station, i) => <Station key={i} station={station} />)}
      </g>
      <g className="station-names">
        {STATIONS.map((station, i) => {
          const coordinates = {
            x: station.x + 11,
            y: station.y + 1,
          };
          return <StationName  key={i} station={station} coordinates={coordinates} />;
        })}
      </g>
    </svg>
    <RoutePopup />,
  </div>;
