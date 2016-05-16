import './style/main.scss';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import IO from './socket/IO';
import { App } from './components/App';
import './socket/listeners';

store.subscribe(() => {
  //console.log(JSON.stringify(store.getState()));
  //console.log(store.getState().game.toJS());
  console.log(store.getState().table.toJS());
});

IO.connect().then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('ttr')
  );
});
