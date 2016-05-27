import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Cards from '../../services/Cards';
import DestinationCard from '../Cards/DestinationCard';



export const PickDestination = ({
  destinations,
  ui,
  handleClick,
}) => {
  let inputDisabled = true;
  if (ui.has('tmpDestinations') && ui.get('tmpDestinations').size >= 2) {
    inputDisabled = false;
  } else {
    inputDisabled = true;
  }
  return (
    <div className="content pick-destination">
      <div className="title">Pick two or more destinations</div>
      <div className="body">
        {destinations && destinations.map((d, i) =>
          <DestinationCard key={i} destination={d} />
        )}
      </div>
      <button
        type="button"
        disabled={inputDisabled}
        onClick={() => {
          if (!inputDisabled) {
            handleClick();
          }
        }}
      >Pick</button>
    </div>
  );
};


PickDestination.propTypes = {
  destinations: PropTypes.object,
  ui: PropTypes.object,
  handleClick: PropTypes.func,
};




const mapStateToProps = state => ({
  ui: state.ui,
});

export default connect(
  mapStateToProps,
  { handleClick: Cards.pickDestinationsThunk }
)(PickDestination);
