import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Message } from './Message';


class Log extends Component {

  constructor(props) {
    super(props);
    this.state = { cssClasses: 'log visible' };
  }

  toggle = () => {
    if (this.state.cssClasses.includes('visible')) {
      this.setState({ cssClasses: 'log' });
    } else {
      this.setState({ cssClasses: 'log visible' });
    }
  }

  render() {
    return (
      <section
        className={this.state.cssClasses}
        onClick={e => {
          e.preventDefault();
          this.toggle();
        }}
      >
        {this.props.messages.map((message, i) =>
          <Message key={i} message={message} />
        )}
      </section>
    );
  }

}

Log.propTypes = {
  messages: PropTypes.any,
};




const mapStateToProps = state => ({
  messages: state.messages,
});

export default connect(mapStateToProps)(Log);
