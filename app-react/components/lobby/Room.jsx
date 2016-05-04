import React, { PropTypes } from 'react';
import RoomAction from './RoomAction';
import { JOIN_ROOM, LEAVE_ROOM } from '../../actions/actionTypes';

export const Room = ({ room }) =>
  <tr key={room.get('id')}>
    <td>{room.get('name')}</td>
    <td>{room.get('owner')}</td>
    <td>{room.get('players').map((player, i) =>
      <div key={i}>
        {player.get('name')}
      </div>
    )}</td>
    <td>{room.get('status')}</td>
    <td>
      <RoomAction action={JOIN_ROOM} room={room} />
      <RoomAction action={LEAVE_ROOM} room={room} />
    </td>
  </tr>;

Room.propTypes = {
  room: PropTypes.object.isRequired,
};
