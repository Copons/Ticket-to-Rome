import React from 'react';
import { STATIONS } from '../../config/stations';


export const Stations = () =>
  <g className="stations">
    {STATIONS.map((station, i) =>
      <circle
        key={i}
        className="station"
        cx={station.x}
        cy={station.y}
      />
    )}
  </g>;
