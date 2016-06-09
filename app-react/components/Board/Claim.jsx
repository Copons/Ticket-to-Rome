import React, { PropTypes } from 'react';
import { Color } from '../Hand/Color';


export const Claim = ({
  claim,
}) =>
  <div className="claim">
    {claim.map((c, i) =>
      <Color color={c.color} count={c.count} key={i} />
    )}
  </div>;

Claim.propTypes = {
  claim: PropTypes.array,
};
