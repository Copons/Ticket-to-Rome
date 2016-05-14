import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Rooms from '../../services/Rooms';


export const CreateRoom = ({
  player,
  handleSubmit,
}) => {
  let input;
  if (!player.has('name')) {
    return <div></div>;
  }
  return (
    <form onSubmit={e => {
      e.preventDefault();
      handleSubmit(input.value, player);
      input.value = '';
    }}>
      <input type="text" placeholder="Room name" ref={node => {
        input = node;
      }} />
      <input type="submit" value="Create new room" />
    </form>
  );
};

CreateRoom.propTypes = {
  player: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};



const mapStateToProps = state => ({
  player: state.player,
});

export default connect(
  mapStateToProps,
  { handleSubmit: Rooms.createRoomDispatch }
)(CreateRoom);
