import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export const Rooms = ({
  rooms,
}) => {
  if (!rooms) {
    return <tbody></tbody>;
  }
  return (
    <tbody>
      {rooms.valueSeq().map(room =>
        <tr key={room.get('id')}>
          <td>{room.get('name')}</td>
          <td>{room.get('owner').get('name')}</td>
          <td></td>
          <td></td>
        </tr>
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
