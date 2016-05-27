import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Cards from '../../services/Cards';


export const Deck = ({
  deck,
  handleClick,
}) =>
  <div
    className="deck"
    onClick={e => {
      e.preventDefault();
      handleClick();
    }}
  >
    Deck
    <span>{deck}</span>
  </div>;

Deck.propTypes = {
  deck: PropTypes.number,
  handleClick: PropTypes.func.isRequired,
};




const mapStateToProps = state => ({
  deck: state.table.get('deck'),
});

export default connect(
  mapStateToProps,
  { handleClick: Cards.drawFromDeckThunk }
)(Deck);
