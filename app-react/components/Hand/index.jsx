import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Color } from './Color';


/*class Hand extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="hand">
        {this.state.colors.forEach((count, color) => {
          <Color color={color} count={count} />;
        })}
      </div>
    );
  }

}*/


export const Hand = ({
  hand,
}) => {
  const colors = new Map();
  if (hand.has('cards')) {
    hand.get('cards').forEach(card => {
      if (colors.has(card.type)) {
        colors.set(card.type, colors.get(card.type) + 1);
      } else {
        colors.set(card.type, 1);
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
