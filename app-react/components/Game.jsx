import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Board } from './Board';


class Game extends Component {

  constructor(props) {
    super(props);
    this.game = props.game;
    this.state = { cssClasses: 'game' };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.has('name')) {
      this.setState({ cssClasses: 'game visible' });
    } else {
      this.setState({ cssClasses: 'game' });
    }
  }

  render() {
    return (
      <section className={this.state.cssClasses}>
        <Board />
      </section>
    );
  }
}

Game.propTypes = {
  game: PropTypes.object.isRequired,
};




const mapStateToProps = state => ({
  game: state.game,
});

export default connect(mapStateToProps)(Game);
