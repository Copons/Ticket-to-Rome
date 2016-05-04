import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Room } from './Room';

export const Rooms = ({ rooms }) => {
  if (rooms.isEmpty()) {
    return <div></div>;
  }
  return (
    <table className="rooms">
      <thead>
        <tr>
          <th>Room</th>
          <th>Owner</th>
          <th>Players</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room, i) =>
          <Room key={i} room={room} />
        )}
      </tbody>
    </table>
  );
};

Rooms.propTypes = {
  rooms: PropTypes.any,
};




const mapStateToProps = state => ({
  rooms: state.rooms,
});

export default connect(mapStateToProps)(Rooms);
