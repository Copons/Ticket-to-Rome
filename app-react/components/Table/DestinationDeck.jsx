import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Cards from '../../services/Cards';


export const DestinationDeck = ({
  destinations,
  handleClick,
}) =>
  <div
    className="destination-deck"
    onClick={e => {
      e.preventDefault();
      handleClick();
    }}
  >
    Destinations
    <span>{destinations}</span>
  </div>;

DestinationDeck.propTypes = {
  destinations: PropTypes.number,
  handleClick: PropTypes.func.isRequired,
};




const mapStateToProps = state => ({
  destinations: state.table.get('destinations'),
});

export default connect(
  mapStateToProps,
  { handleClick: Cards.drawDestinationThunk }
)(DestinationDeck);
