import React, { PropTypes } from 'react';

export const Message = ({ message }) => {
  const cssClasses = `message ${message.get('type').toLowerCase()}`;
  return (
    <div
      className={cssClasses}
    >
      {message.get('text')}
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
};
