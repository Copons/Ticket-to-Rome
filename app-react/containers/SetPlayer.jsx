import React, { Component } from 'react';
import uuid from 'node-uuid';
import { io } from '../libs/io';

export default class SetPlayer extends Component {

  constructor() {
    super();
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.input.value);
    io.emit('CREATE_PLAYER', {
      id: uuid.v4(),
      name: this.input.value,
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref={node => {
          this.input = node;
        }} />
        <input type="submit" value="New Player" />
      </form>
    );
  }

}
