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
  /*if (store.getState().game.get('players')) {
    console.log('PLAYER', store.getState().player.toJS());
    console.log('GAME PLAYERS', store.getState().game.get('players').toJS());
    console.log('TABLE', store.getState().table.toJS());
  }*/
});

IO.connect().then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('ttr')
  );
});
