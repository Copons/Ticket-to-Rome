import React from 'react';
import ReactDOM from 'react-dom';
import { io } from './libs/io';
import App from './components/App';

io.connect().then(() => {
  ReactDOM.render(<App />, document.getElementById('ttr'));
});
