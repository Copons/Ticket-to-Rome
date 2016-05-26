import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { STATIONS } from '../../config/stations';
import UI from '../../services/UI';


export const PickDestination = ({
  game,
  handleHover,
}) =>
  <div className="content pick-destination">
    <div className="title">Pick a destination</div>
    <div className="body">
      {game.get('setup') && game.get('setup').get('destinationsToChoose').map((d, i) =>
        <div
          className="destination"
          key={i}
          onMouseOver={() => {
            handleHover([d.get('destination').get('start'), d.get('destination').get('end')]);
          }}
          onMouseOut={() => {
            handleHover([]);
          }}
        >
          <div className="route">
            <span className="start">
              {STATIONS.find(s => s.slug === d.get('destination').get('start')).name}
            </span>
            <span className="end">
              {STATIONS.find(s => s.slug === d.get('destination').get('end')).name}
            </span>
          </div>
          <div className="points">
            {d.get('destination').get('points')}
          </div>
        </div>
      )}
    </div>
  </div>;

PickDestination.propTypes = {
  game: PropTypes.object.isRequired,
  handleHover: PropTypes.func.isRequired,
};




const mapStateToProps = state => ({
  game: state.game,
});

export default connect(
  mapStateToProps,
  {
    handleHover: UI.highlightStationsAction,
  }
)(PickDestination);
