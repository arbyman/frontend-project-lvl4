import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers/';
import Chat from './components/Chat';
import Channels from './components/Channels';
import MessagesField from './components/MessagesField';
import MessagesInput from './components/MessagesInput';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/application.css';
import faker from 'faker';
import gon from 'gon';
import cookies from 'js-cookie';
import io from 'socket.io-client';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}
const { channels, currentChannelId } = gon;
const defaultState = {
  channels: {
    byId: _.keyBy(channels, 'id'),
    allIds: channels.map(({ id }) => id),
    currentChannelId,
  }
}
const store = createStore(
  reducers,
  defaultState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
const container = document.getElementById('chat');
render(
  <Provider store={store}>
    <Chat>
      <Channels />
      <div className="col-9">
        <MessagesField />
        <MessagesInput />
      </div>
    </Chat>
  </Provider>,
  container,
);
