import React, { PropTypes } from 'react';
import RoomAction from './RoomAction';
import { JOIN_ROOM, LEAVE_ROOM, START_GAME } from '../../actions';

export const Room = ({ room }) =>
  <tr key={room.get('id')}>
    <td className="name">
      {room.get('name')}
    </td>
    <td className="owner">
      {room.get('owner').get('name')}
    </td>
    <td className="players">
      {room.get('players').map((player, i) =>
        <div key={i}>
          {player.get('name')}
        </div>
      )}
    </td>
    <td className="status">
      {room.get('status')}
    </td>
    <td className="actions">
      <RoomAction action={START_GAME} room={room} />
      <RoomAction action={JOIN_ROOM} room={room} />
      <RoomAction action={LEAVE_ROOM} room={room} />
    </td>
  </tr>;

Room.propTypes = {
  room: PropTypes.object.isRequired,
};
