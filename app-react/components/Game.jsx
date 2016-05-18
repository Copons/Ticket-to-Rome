import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UI from '../services/UI';
import { Board } from './Board';
import InfoBar from './InfoBar';
import { Table } from './Table';


class Game extends Component {

  constructor(props) {
    super(props);
    this.game = props.game;
    this.ui = props.ui;
    this.handleClick = props.handleClick;

    this.state = { cssClasses: 'game' };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game.has('id')) {
      this.setState({ cssClasses: 'game visible' });
    } else {
      this.setState({ cssClasses: 'game' });
    }
  }

  render() {
    return (
      <section
        className={this.state.cssClasses}
        onClick={e => {
          const popup = document.querySelector('.route-popup');
          if (
            e.target.classList.contains('route-popup') ||
            popup.contains(e.target) ||
            e.target.classList.contains('route')
          ) return;

          this.handleClick(false);
        }}
      >
        <InfoBar />
        <Table />
        <Board />
      </section>
    );
  }
}

Game.propTypes = {
  game: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
};




const mapStateToProps = state => ({
  game: state.game,
  ui: state.ui,
});

export default connect(
  mapStateToProps,
  { handleClick: UI.toggleRoutePopupThunk }
)(Game);
