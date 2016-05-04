import uuid from 'node-uuid';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import IO from '../../socket/IO';
import { CREATE_ROOM } from '../../actions/actionTypes';


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

function dispatchCreateRoom(name) {
  return (dispatch, getState) => {
    const player = getState().player;
    if (name === '' || !player.has('name')) return;

    IO.emit(CREATE_ROOM, {
      name,
      id: uuid.v4(),
      owner: player.get('id'),
    });
  };
}

export default connect(
  mapStateToProps,
  { handleSubmit: dispatchCreateRoom }
)(CreateRoom);
