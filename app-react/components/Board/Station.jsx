import React, { PropTypes } from 'react';


export const Station = ({
  station,
}) =>
  <circle
    className="station"
    cx={station.x}
    cy={station.y}
    slug={station.slug}
  />;

Station.propTypes = {
  station: PropTypes.object.isRequired,
};
