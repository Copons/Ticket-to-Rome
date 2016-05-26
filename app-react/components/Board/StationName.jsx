import React, { PropTypes } from 'react';


export const StationName = ({
  station,
  coordinates,
}) =>
  <text
    className="station-name"
    x={coordinates.x}
    y={coordinates.y}
    transform={`rotate(-30, ${coordinates.x}, ${coordinates.y})`}
  >
    {station.name}
  </text>;

StationName.propTypes = {
  station: PropTypes.object.isRequired,
  coordinates: PropTypes.object.isRequired,
};
