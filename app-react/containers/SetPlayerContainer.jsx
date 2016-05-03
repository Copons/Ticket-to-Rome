import uuid from 'node-uuid';
import { connect } from 'react-redux';
import { io } from '../libs/io';
import { CREATE_PLAYER, UPDATE_PLAYER } from '../API';
import { createPlayer, updatePlayer } from '../actions';
import { SetPlayer } from '../components/SetPlayer';

const mapStateToProps = state => ({
  player: state.player,
});

function setPlayer(name) {
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
        id: uuid.v4(),
        name,
      };
    }

    io.emit(action, player)
      .then(() => {
        if (action === CREATE_PLAYER) {
          return dispatch(createPlayer(player));
        } else if (action === UPDATE_PLAYER) {
          return dispatch(updatePlayer(player));
        }
      });
  };
}

export const SetPlayerContainer = connect(
  mapStateToProps,
  { onSubmit: setPlayer }
)(SetPlayer);
