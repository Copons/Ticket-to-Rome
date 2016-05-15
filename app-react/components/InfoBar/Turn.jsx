import React, { PropTypes } from 'react';


export const Turn = ({
  turn,
}) =>
  <div className="turn">
    <div>Turn</div>
    <div>{turn}</div>
  </div>;

Turn.propTypes = {
  turn: PropTypes.number,
};
