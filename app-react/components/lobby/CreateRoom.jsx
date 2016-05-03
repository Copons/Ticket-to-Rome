import uuid from 'node-uuid';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { io } from '../../libs/io';
import { CREATE_ROOM } from '../../API';


function handleSubmit(name, player) {
  if (name === '' || !player.has('name')) return;
  io.emit(CREATE_ROOM, {
    name,
    id: uuid.v4(),
    owner: player.get('id'),
  })
    .then(response => {
      console.log(response);
    })
    .catch(response => {
      console.error(response);
    });
}

export const CreateRoom = ({
  player,
}) => {
  let input;
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
};



const mapStateToProps = state => ({
  player: state.player,
});

export default connect(
  mapStateToProps
)(CreateRoom);
