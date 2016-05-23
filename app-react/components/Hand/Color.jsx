import React, { PropTypes } from 'react';


export const Color = ({
  color,
  count,
}) => {
  const cssClasses = `color ${color}`;
  return (
    <div className={cssClasses}>
      {count}
    </div>
  );
};

Color.propTypes = {
  color: PropTypes.string,
  count: PropTypes.number,
};
