import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Cards from '../../services/Cards';


export const Pile = ({
  cards,
  handleClick,
}) =>
  <div className="pile">
    <div className="title">Pile</div>
    {cards && cards.map((c, i) =>
      <div
        className={`color ${c.get('type')}`}
        key={i}
        cardId={c.get('id')}
        type={c.get('type')}
        onClick={e => {
          e.preventDefault();
          handleClick(c);
        }}
      >&nbsp;</div>
    )}
  </div>;

Pile.propTypes = {
  cards: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
};




const mapStateToProps = state => ({
  cards: state.table.get('pile'),
});

export default connect(
  mapStateToProps,
  { handleClick: Cards.drawFromPileThunk }
)(Pile);
