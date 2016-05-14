import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';


export class RoutePopup extends Component {

  constructor(props) {
    super(props);

    if (props.ui.has('routePopup')) {
      this.popup = props.ui.get('routePopup');
    } else {
      this.popup = false;
    }

    this.state = { cssClasses: 'route-popup' };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.has('routePopup')) {
      this.popup = nextProps.ui.get('routePopup');
      this.setState({ cssClasses: 'route-popup visible' });
    } else {
      this.setState({ cssClasses: 'route-popup' });
      setTimeout(() => {
        this.popup = false;
      }, 200);
    }
  }

  render() {
    return (
      <div className={this.state.cssClasses}>
        {this.popup.toString()}
      </div>
    );
  }

}

RoutePopup.propTypes = {
  ui: PropTypes.object,
};




const mapStateToProps = state => ({
  ui: state.ui,
});

export default connect(mapStateToProps)(RoutePopup);
