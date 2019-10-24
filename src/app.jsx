import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
// import io from 'socket.io-client';
import reducers from './reducers';
import Chat from './components/Chat';
import Channels from './components/Channels';
import MessagesField from './components/MessagesField';
import MessagesInput from './components/MessagesInput';
// import faker from 'faker';
// import cookies from 'js-cookie';

export default ({ channels, currentChannelId }) => {
  const defaultState = {
    channels: {
      byId: _.keyBy(channels, 'id'),
      allIds: channels.map(({ id }) => id),
      currentChannelId,
    },
  };
  const store = createStore(
    reducers,
    defaultState,
    compose(
      applyMiddleware(thunk),
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
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
};
