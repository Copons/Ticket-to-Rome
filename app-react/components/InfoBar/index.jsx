import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Player } from './Player';
import { Turn } from './Turn';


export const InfoBar = ({
  game,
}) =>
  <nav className="info-bar">
    <Turn turn={game.get('turn')} />
    {game.has('players') && game.get('players').map((p, i) =>
      <Player key={i} player={p} />
    )}
  </nav>;

InfoBar.propTypes = {
  game: PropTypes.object.isRequired,
};



const mapStateToProps = state => ({
  game: state.game,
});

export default connect(mapStateToProps)(InfoBar);
