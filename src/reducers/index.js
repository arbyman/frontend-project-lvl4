import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash';
import * as actions from '../actions';

const defaultChannelId = 1;

const channels = handleActions({
  [actions.updateChannelNew](state, { payload: { channel } }) {
    const { id } = channel;
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [id]: channel },
      allIds: [...allIds, id],
      currentChannelId: id,
    };
  },
  [actions.changeChannel](state, { payload: { id } }) {
    const { byId } = state;
    const { [id]: channel } = byId;
    const updatedChannel = { ...channel, unreadMessagesCount: 0 };
    return { ...state, byId: { ...byId, [id]: updatedChannel }, currentChannelId: id };
  },
  [actions.updateChannelRemoved](state, { payload: { id } }) {
    const { byId, allIds } = state;
    return {
      byId: _.omit(byId, id),
      allIds: _.without(allIds, id),
      currentChannelId: defaultChannelId,
    };
  },
  [actions.updateChannelName](state, { payload: { id, name } }) {
    const { byId } = state;
    const channel = byId[id];
    const renamedChannel = { ...channel, name };
    return {
      ...state,
      byId: { ...byId, [id]: renamedChannel },
    };
  },
  [actions.updateMessages](state, { payload: { message } }) {
    const { byId } = state;
    const { channelId, unread } = message;
    const currentChannel = byId[channelId];
    const { unreadMessagesCount } = currentChannel;
    const updatedChannel = {
      ...currentChannel,
      unreadMessagesCount: unread ? unreadMessagesCount + 1 : unreadMessagesCount,
    };
    return {
      ...state,
      byId: { ...byId, [channelId]: updatedChannel },
    };
  },
}, { byId: {}, allIds: [], currentChannelId: defaultChannelId });

const messages = handleActions({
  [actions.updateMessages](state, { payload: { message } }) {
    const { id } = message;
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [id]: message },
      allIds: [...allIds, id],
    };
  },
  [actions.updateChannelRemoved](state, { payload: { id } }) {
    const { byId, allIds } = state;
    return {
      byId: _.omitBy(byId, ({ channelId }) => channelId === id),
      allIds: allIds.filter(currentId => byId[currentId].channelId !== id),
    };
  },
}, { byId: {}, allIds: [] });

const modalAddChannelUIState = handleActions({
  [actions.inverseShowModalAddChannel](state) {
    return state === 'close' ? 'open' : 'close';
  },
}, 'close');

const modalRemoveChannelUIState = handleActions({
  [actions.inverseShowModalRemoveChannel](state) {
    return state === 'close' ? 'open' : 'close';
  },
}, 'close');

const modalRenameChannelUIState = handleActions({
  [actions.inverseShowModalRenameChannel](state) {
    return state === 'close' ? 'open' : 'close';
  },
}, 'close');

const sendMessageState = handleActions({
  [actions.sendMessageRequest]() {
    return 'requested';
  },
  [actions.sendMessageSuccess]() {
    return 'succeed';
  },
  [actions.sendMessageFailure]() {
    return 'failed';
  },
}, 'none');

const addChannelState = handleActions({
  [actions.addChannelRequest]() {
    return 'requested';
  },
  [actions.addChannelSuccess]() {
    return 'succeed';
  },
  [actions.addChannelFailure]() {
    return 'failed';
  },
}, 'none');

const removeChannelState = handleActions({
  [actions.removeChannelRequest]() {
    return 'requested';
  },
  [actions.removeChannelSuccess]() {
    return 'succeed';
  },
  [actions.removeChannelFailure]() {
    return 'failed';
  },
}, 'none');

const renameChannelState = handleActions({
  [actions.renameChannelRequest]() {
    return 'requested';
  },
  [actions.renameChannelSuccess]() {
    return 'succeed';
  },
  [actions.renameChannelFailure]() {
    return 'failed';
  },
}, 'none');

export default combineReducers({
  channels,
  messages,
  sendMessageState,
  addChannelState,
  removeChannelState,
  renameChannelState,
  modalAddChannelUIState,
  modalRemoveChannelUIState,
  modalRenameChannelUIState,
  form: formReducer,
});
