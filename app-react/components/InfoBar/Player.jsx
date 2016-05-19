import React, { PropTypes } from 'react';
import { PlayerInfo } from './PlayerInfo';


export const Player = ({
  player,
}) =>
  <div className="player">
    <div className="name">
      <span className={player.get('color')}></span>
      {player.get('name')}
    </div>
    <div className="info">
      <PlayerInfo type="points" amount={player.get('points')} />
      <PlayerInfo type="cards" amount={player.get('cards')} />
      <PlayerInfo type="pieces" amount={player.get('pieces')} />
      <PlayerInfo type="destinations" amount={player.get('destinations')} />
    </div>
  </div>;

Player.propTypes = {
  player: PropTypes.object,
};
