import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


export const Pile = ({
  cards,
}) =>
  <div className="pile">
    <div className="title">Pile</div>
    {cards && cards.map((c, i) =>
      <div
        className={`color ${c.get('type')}`}
        key={i}
        cardId={c.get('id')}
        type={c.get('type')}
      >&nbsp;</div>
    )}
  </div>;

Pile.propTypes = {
  cards: PropTypes.array,
};




const mapStateToProps = state => ({
  cards: state.table.get('pile'),
});

export default connect(mapStateToProps)(Pile);
