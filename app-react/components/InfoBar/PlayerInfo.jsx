import React, { PropTypes } from 'react';


export const PlayerInfo = ({
  type,
  amount,
}) =>
  <div className={type}>
    <span className="amount">{amount}</span>
    <span className="icon" />
  </div>;

PlayerInfo.propTypes = {
  type: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};
