import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


export const Deck = ({
  deck,
}) =>
  <div className="deck">
    {deck && deck.map((c, i) =>
      <span key={i} className={c.get('type')}>
        {c.get('id')}
      </span>
    )}
  </div>;

Deck.propTypes = {
  deck: PropTypes.object,
};




const mapStateToProps = state => ({
  deck: state.table.get('deck'),
});

export default connect(mapStateToProps)(Deck);
