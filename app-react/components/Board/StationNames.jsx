import React from 'react';
import { STATIONS } from '../../config/stations';


export const StationNames = () =>
  <g className="station-names">
    {STATIONS.map((station, i) => {
      // x + radius + name - stroke
      // y + radius - name - stroke
      const coordinates = {
        x: station.x + 11,
        y: station.y - 1,
      };
      return (
        <text
          key={i}
          className="station-name"
          x={coordinates.x}
          y={coordinates.y}
          transform={`rotate(-30, ${coordinates.x}, ${coordinates.y})`}
        >
          {station.name}
        </text>
      );
    })}
  </g>;
