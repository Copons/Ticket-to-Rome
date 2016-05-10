import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { JOIN_ROOM, LEAVE_ROOM, START_GAME } from '../../actions';
import Rooms from '../../services/Rooms';


export const RoomAction = ({
  action,
  room,
  player,
}) => {
  let inputValue = '';

  const playerInRoom = Rooms.containsPlayer(room, player);

  switch (action) {
    case JOIN_ROOM: {
      if (Rooms.isOpen(room) || playerInRoom) {
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
      if (!Rooms.isPlayerOwner(room, player)) {
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
        Rooms.onActionButtonClick(action, room, player);
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
