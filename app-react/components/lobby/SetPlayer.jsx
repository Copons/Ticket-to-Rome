import uuid from 'node-uuid';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { io } from '../../libs/io';
import { CREATE_PLAYER, UPDATE_PLAYER } from '../../API';
import { setPlayer } from '../../actions';


export const SetPlayer = ({
  player,
  onSubmit,
}) => {
  let input;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (input.value === '') return;
      onSubmit(input.value);
      input.value = '';
    }}>
      <input type="text" placeholder="Your name" ref={node => {
        input = node;
      }} />
      <input type="submit" value={
        player.has('name') ? 'Change name' : 'Create new player'
      } />
    </form>
  );
};

SetPlayer.propTypes = {
  player: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};




const mapStateToProps = state => ({
  player: state.player,
});

function dispatchSetPlayer(name) {
  return (dispatch, getState) => {
    let action;
    let player;
    if (getState().player.has('name')) {
      action = UPDATE_PLAYER;
      player = {
        ...getState().player.toJS(),
        name,
      };
    } else {
      action = CREATE_PLAYER;
      player = {
        ...getState().player.toJS(),
        id: uuid.v4(),
        name,
      };
    }

    io.emit(action, player).then(() => dispatch(setPlayer(player)));
  };
}

export default connect(
  mapStateToProps,
  { onSubmit: dispatchSetPlayer }
)(SetPlayer);
