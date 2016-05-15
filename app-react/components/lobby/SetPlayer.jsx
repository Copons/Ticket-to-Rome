import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Player from '../../services/Player';


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
      <input
        type="submit"
        value={ player.has('name') ? 'Change name' : 'Create new player' }
      />
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

export default connect(
  mapStateToProps,
  { handleSubmit: Player.setPlayerDispatch }
)(SetPlayer);
