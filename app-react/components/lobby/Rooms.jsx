import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Room } from './Room';

export const Rooms = ({
  rooms,
}) => {
  if (!rooms) {
    return <tbody></tbody>;
  }
  return (
    <tbody>
      {rooms.map(room =>
        <Room key={room.get('id')} room={room} />
      )}
    </tbody>
  );
};

Rooms.propTypes = {
  rooms: PropTypes.any,
};




const mapStateToProps = state => ({
  rooms: state.rooms,
});

export default connect(mapStateToProps)(Rooms);
