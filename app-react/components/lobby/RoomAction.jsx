import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { findEntryById } from '../../helpers/find';
import IO from '../../socket/IO';
import { JOIN_ROOM, LEAVE_ROOM, START_GAME } from '../../actions/actionTypes';


function handleClick(action, roomId, playerId) {
  if (action === START_GAME) {
    IO.emit(action, roomId);
  } else {
    IO.emit(action, { roomId, playerId });
  }
}

export const RoomAction = ({
  action,
  room,
  player,
}) => {
  let inputValue = '';

  const playerInRoom = findEntryById(room.get('players'), player.get('id'));

  switch (action) {
    case JOIN_ROOM: {
      if (room.get('status') !== 'open' || playerInRoom) {
        return <span></span>;
      }
      inputValue = 'Join Room';
      break;
    }
    case LEAVE_ROOM: {
      if (!playerInRoom) {
        return <span></span>;
      }
      inputValue = 'Leave Room';
      break;
    }
    case START_GAME: {
      if (player.get('id') !== room.get('owner').get('id')) {
        return <span></span>;
      }
      inputValue = 'Start Game';
      break;
    }
  }

  return (
    <input
      type="submit"
      value={inputValue}
      onClick={e => {
        e.preventDefault();
        handleClick(action, room.get('id'), player.get('id'));
      }}
    />
  );
};

RoomAction.propTypes = {
  action: PropTypes.string.isRequired,
  room: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
};




const mapStateToProps = state => ({
  player: state.player,
});

export default connect(mapStateToProps)(RoomAction);
