import React, { PropTypes } from 'react';

export const SetPlayer = ({
  player,
  onSubmit,
}) => {
  let input;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (input.value === '') return;
      onSubmit(input.value);
    }}>
      <input type="text" placeholder="Your name" ref={node => {
        input = node;
      }} />
      <input type="submit" value={
        player.has('name') ? 'Change name' : 'Create new player'
      } />
    </form>
  );
};

SetPlayer.propTypes = {
  player: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
