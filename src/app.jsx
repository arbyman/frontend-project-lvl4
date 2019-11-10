import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import faker from 'faker';
import cookies from 'js-cookie';
import reducers from './reducers';
import Chat from './components/Chat';
import UserContext from './UserContext';

const getUserFromCookie = () => cookies.get('userName');

const createNewUser = () => {
  const user = faker.name.findName();
  cookies.set('userName', user);
  return user;
};

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
  const container = document.getElementById('chat');
  const user = getUserFromCookie() || createNewUser();
  console.log(user);

  render(
    <Provider store={store}>
      <UserContext.Provider value={user}>
        <Chat />
      </UserContext.Provider>
    </Provider>,
    container,
  );
};
