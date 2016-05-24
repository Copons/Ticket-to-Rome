import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Color } from './Color';


export const Hand = ({
  hand,
}) => {
  const colors = new Map();
  if (hand.has('cards')) {
    hand.get('cards').forEach(card => {
      const type = card.get('type');
      if (colors.has(type)) {
        colors.set(type, colors.get(type) + 1);
      } else {
        colors.set(type, 1);
      }
    });
  }

  return (
    <div className="hand">
      <div className="title">Hand</div>
      {[...colors].map((c, i) =>
        <Color color={c[0]} count={c[1]} key={i} />
      )}
    </div>
  );
};

Hand.propTypes = {
  hand: PropTypes.object.isRequired,
};



const mapStateToProps = state => ({
  hand: state.hand,
});

export default connect(mapStateToProps)(Hand);
