import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


export const StationName = ({
  station,
  coordinates,
  ui,
}) => {
  let cssClasses = '';
  if (
    ui.has('stationsHighlight') &&
    ui.get('stationsHighlight').find(s => s === station.slug)
  ) {
    cssClasses = 'station-name highlight';
  } else {
    cssClasses = 'station-name';
  }
  return (
    <text
      className={cssClasses}
      x={coordinates.x}
      y={coordinates.y}
      slug={station.slug}
      transform={`rotate(-30, ${coordinates.x}, ${coordinates.y})`}
    >
      {station.name}
    </text>
  );
};

StationName.propTypes = {
  station: PropTypes.object.isRequired,
  coordinates: PropTypes.object.isRequired,
  ui: PropTypes.object,
};




const mapStateToProps = state => ({
  ui: state.ui,
});

export default connect(mapStateToProps)(StationName);
