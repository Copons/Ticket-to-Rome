import uuid from 'node-uuid';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import IO from '../../socket/IO';
import { CREATE_PLAYER, UPDATE_PLAYER } from '../../actions/actionTypes';
import { setPlayer, setRooms } from '../../actions';


export const SetPlayer = ({
  player,
  handleSubmit,
}) => {
  let input;
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (input.value === '') return;
      handleSubmit(input.value);
      input.value = '';
    }}>
      <input
        type="text"
        placeholder={ player.has('name') ? player.get('name') : 'Your name' }
        ref={node => {
          input = node;
        }}
      />
      <input type="submit" value={ player.has('name') ? 'Change name' : 'Create new player' } />
    </form>
  );
};

SetPlayer.propTypes = {
  player: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
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

    IO.emit(action, player).then(() => {
      dispatch(setPlayer(player));
    });
  };
}

export default connect(
  mapStateToProps,
  { handleSubmit: dispatchSetPlayer }
)(SetPlayer);
