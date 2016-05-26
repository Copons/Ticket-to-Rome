import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


export const Station = ({
  station,
  ui,
}) => {
  let cssClasses = '';
  if (
    ui.has('stationsHighlight') &&
    ui.get('stationsHighlight').find(s => s === station.slug)
  ) {
    cssClasses = 'station highlight';
  } else {
    cssClasses = 'station';
  }
  return (
    <circle
      className={cssClasses}
      cx={station.x}
      cy={station.y}
      slug={station.slug}
    />
  );
};

Station.propTypes = {
  station: PropTypes.object.isRequired,
  ui: PropTypes.object,
};




const mapStateToProps = state => ({
  ui: state.ui,
});

export default connect(mapStateToProps)(Station);
