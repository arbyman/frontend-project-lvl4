import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import io from 'socket.io-client';
import _ from 'lodash';
import faker from 'faker';
import cookies from 'js-cookie';
import reducers from './reducers';
import Chat from './components/Chat';
import UserContext from './UserContext';
import * as actions from './actions';

const setUsername = () => {
  const username = faker.name.findName();
  cookies.set('username', username);
};

const getUsername = () => cookies.get('username');

export default ({ channels, currentChannelId, messages }) => {
  const defaultState = {
    channels: {
      byId: _.keyBy(channels, 'id'),
      allIds: channels.map(({ id }) => id),
      currentChannelId,
    },
    messages: {
      byId: _.keyBy(messages, 'id'),
      allIds: messages.map(({ id }) => id),
    },
  };

  const store = createStore(
    reducers,
    defaultState,
    compose(
      applyMiddleware(thunk),
      // eslint-disable-next-line no-underscore-dangle
      // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
  );

  const socket = io();
  socket.on('removeChannel', ({ data: { id } }) => {
    store.dispatch(actions.updateChannelRemoved({ id }));
  });
  socket.on('renameChannel', (data) => {
    const { data: { attributes: { id, name } } } = data;
    store.dispatch(actions.updateChannelName({ id, name }));
  });
  socket.on('newChannel', (data) => {
    const { data: { attributes: channel } } = data;
    store.dispatch(actions.updateChannelNew({ channel }));
  });

  const container = document.getElementById('chat');

  if (!getUsername()) {
    setUsername();
  }

  const username = getUsername();

  render(
    <Provider store={store}>
      <UserContext.Provider value={username}>
        <Chat />
      </UserContext.Provider>
    </Provider>,
    container,
  );
};
