import React, { PropTypes } from 'react';


export const PlayerInfo = ({
  type,
}) =>
  <div className={type}>
    <span className="count">0</span>
    <span className="icon" />
  </div>;

PlayerInfo.propTypes = {
  type: PropTypes.string.isRequired,
};
