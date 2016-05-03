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
      {rooms.map(room => {
        <tr>
          {JSON.stringify(room)}
        </tr>;
      })}
    </tbody>
  );
};

Rooms.propTypes = {
  rooms: PropTypes.array,
};




const mapStateToProps = state => ({
  rooms: state.rooms,
});

export default connect(mapStateToProps)(Rooms);
