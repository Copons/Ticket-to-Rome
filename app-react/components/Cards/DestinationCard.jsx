import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { STATIONS } from '../../config/stations';
import UI from '../../services/UI';


class DestinationCard extends Component {

  constructor(props) {
    super(props);
    this.destination = props.destination.get('destination');
    this.handleHover = props.handleHover;

    this.state = { cssClasses: 'destination-card' };
  }

  handleClick = () => {
    if (this.state.cssClasses === 'destination-card') {
      this.setState({ cssClasses: 'destination-card selected' });
      UI.addTmpDestination(this.destination);
    } else {
      this.setState({ cssClasses: 'destination-card' });
      UI.removeTmpDestination(this.destination);
    }
  }

  render() {
    return (
      <div
        className={this.state.cssClasses}
        onClick={() => {
          this.handleClick();
        }}
        onMouseOver={() => {
          this.handleHover([
            this.destination.get('start'),
            this.destination.get('end'),
          ]);
        }}
        onMouseOut={() => {
          this.handleHover([]);
        }}
      >
        <div className="route">
          <span className="start">
            {STATIONS.find(s => s.slug === this.destination.get('start')).name}
          </span>
          <span className="end">
            {STATIONS.find(s => s.slug === this.destination.get('end')).name}
          </span>
        </div>
        <div className="points">
          {this.destination.get('points')}
        </div>
      </div>
    );
  }
}

DestinationCard.propTypes = {
  destination: PropTypes.object,
  handleHover: PropTypes.func.isRequired,
};




export default connect(
  null,
  {
    handleHover: UI.highlightStationsAction,
  }
)(DestinationCard);
