import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { ChangeTurn } from './ChangeTurn';
import PickDestination from './PickDestination';


class Modal extends Component {

  constructor(props) {
    super(props);
    this.player = props.player;
    this.game = props.game;

    this.state = {
      cssClasses: 'modal',
      changeTurn: false,
      pickDestination: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.hasIn(['setup', 'destinationsToChoose'])) {
      this.game = nextProps.game;
      this.setState({
        cssClasses: 'modal visible',
        pickDestination: true,
      });
    } else {
      this.setState({
        cssClasses: 'modal',
        pickDestination: false,
      });
    }
  }

  render() {
    return (
      <div className={this.state.cssClasses}>
        {this.state.changeTurn ?
          <ChangeTurn /> : <div />
        }
        {this.state.pickDestination ?
          <PickDestination
            destinations={this.game.get('setup').get('destinationsToChoose').filter(d =>
              d.player === this.player.get('id')
            )}
          /> : <div />
        }
      </div>
    );
  }

}

Modal.propTypes = {
  player: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
};




const mapStateToProps = state => ({
  player: state.player,
  game: state.game,
});

export default connect(mapStateToProps)(Modal);
