import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { io } from './libs/io';
import App from './components/App';

store.subscribe(() => {
  console.log(JSON.stringify(store.getState()));
});


io.connect().then(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('ttr')
  );
});
