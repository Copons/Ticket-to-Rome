import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Cards from '../../services/Cards';
import { Color } from './Color';
import { Destinations } from './Destinations';


class Hand extends Component {

  constructor(props) {
    super(props);
    this.state = { cssClasses: 'hand visible' };
  }

  toggle = () => {
    if (this.state.cssClasses.includes('visible')) {
      this.setState({ cssClasses: 'hand' });
    } else {
      this.setState({ cssClasses: 'hand visible' });
    }
  }

  render() {
    const colors = Cards.mapColors(this.props.hand);
    return (
      <div className={this.state.cssClasses} >
        <div
          className="title"
          onClick={this.toggle}
        >Hand</div>
        <div className="colors">
          {[...colors].map((c, i) =>
            <Color color={c[0]} count={c[1]} key={i} />
          )}
        </div>
        <Destinations destinations={this.props.hand.get('destinations')} />
      </div>
    );
  }

}

Hand.propTypes = {
  hand: PropTypes.object.isRequired,
};



const mapStateToProps = state => ({
  hand: state.hand,
});

export default connect(mapStateToProps)(Hand);
