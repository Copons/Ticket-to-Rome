import React, { PropTypes } from 'react';
import { STATIONS } from '../../config/stations';


export const Destinations = ({
  destinations,
}) =>
  <div className="destinations">
    {destinations && destinations.map((d, i) =>
      <div className="destination" key={i}>
        <span className="start">
          {STATIONS.find(s => s.slug === d.get('start')).name}
        </span>
        <span className="end">
          {STATIONS.find(s => s.slug === d.get('end')).name}
        </span>
        <span className="points">
          {d.get('points')}
          <span className="icon" />
        </span>
      </div>
    )}
  </div>;

Destinations.propTypes = {
  destinations: PropTypes.object,
};
