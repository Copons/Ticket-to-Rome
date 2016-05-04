import React, { PropTypes } from 'react';

export const Room = props =>
  <tr key={props.room.get('id')}>
    <td>{props.room.get('name')}</td>
    <td>{props.room.get('owner')}</td>
    <td>{props.room.get('players').map(player =>
      <span key={player.get('id')}>
        {player.get('name')}
      </span>
    )}</td>
    <td></td>
  </tr>;

Room.propTypes = {
  room: PropTypes.object.isRequired,
};
