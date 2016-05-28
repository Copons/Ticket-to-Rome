import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Cards from '../../services/Cards';
import DestinationCard from '../Cards/DestinationCard';


class PickDestinations extends Component {

  constructor(props) {
    super(props);

    this.state = {
      destinationsPicked: false,
      inputDisabled: true,
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.ui.has('tmpDestinations') && nextProps.ui.get('tmpDestinations').size >= 2) {
      this.setState({ inputDisabled: false });
    } else {
      this.setState({ inputDisabled: true });
    }
  }

  render() {
    if (this.state.destinationsPicked) return <div />;

    return (
      <div className="content pick-destination">
        <div className="title">Pick two or more destinations</div>
        <div className="body">
          {this.props.destinations && this.props.destinations.map((d, i) =>
            <DestinationCard
              key={i}
              destination={d}
            />
          )}
        </div>
        {!this.state.inputDisabled ?
          <button
            type="button"
            onClick={() => {
              this.props.handleClick();
              this.setState({ destinationsPicked: true });
            }}
          >
            Pick
          </button>
          : <span />
        }
      </div>
    );
  }
}


/*export const PickDestination = ({
  destinations,
  ui,
  handleClick,
}) => {
  let destinationsPicked = false;
  let inputDisabled = true;
  if (ui.has('tmpDestinations') && ui.get('tmpDestinations').size >= 2) {
    inputDisabled = false;
  } else {
    inputDisabled = true;
  }

  if (destinationsPicked) {
    return <div />;
  } else {
    return (
      <div className="content pick-destination">
        <div className="title">Pick two or more destinations</div>
        <div className="body">
          {destinations && destinations.map((d, i) =>
            <DestinationCard
              key={i}
              destination={d}
            />
          )}
        </div>
        {!inputDisabled ?
          <button
            type="button"
            onClick={() => {
              handleClick();
              inputDisabled = true;
              destinationsPicked = true;
            }}
          >
            Pick
          </button>
          : <span />
        }
      </div>
    );
  }
};*/


PickDestinations.propTypes = {
  destinations: PropTypes.object,
  ui: PropTypes.object,
  handleClick: PropTypes.func,
};




const mapStateToProps = state => ({
  ui: state.ui,
});

export default connect(
  mapStateToProps,
  { handleClick: Cards.pickDestinationsThunk }
)(PickDestinations);
