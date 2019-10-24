import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const channels = handleActions({
  [actions.addChannel](state, { payload: { channel } }) {
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [channel.id]: channel },
      allIds: [channel.id, ...allIds],
    };
  },
}, { byId: {}, allIds: [], currentChannelId: 1 });

const messages = handleActions({
  [actions.sendMessageSuccess](state, { payload: { author, message } }) {
    const { byId, allIds } = state;
    const newMessage = {
      id: _.uniqueId(),
      author,
      message,
    };
    return {
      byId: { ...byId, [newMessage.id]: newMessage },
      allIds: [...allIds, newMessage.id],
    };
  },
}, { byId: {}, allIds: [] });

export default combineReducers({
  channels,
  messages,
  form: formReducer,
});
