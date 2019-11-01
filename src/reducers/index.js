// import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash';
import * as actions from '../actions';

const channels = handleActions({
  [actions.addChannelSuccess](state, { payload: { data } }) {
    const { data: { attributes } } = data;
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [attributes.id]: attributes },
      allIds: [...allIds, attributes.id],
      currentChannelId: attributes.id,
    };
  },
  [actions.changeChannel](state, { payload: { id } }) {
    return { ...state, currentChannelId: id };
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    const { byId, allIds, currentChannelId } = state;
    return {
      byId: _.omit(byId, id),
      allIds: _.without(allIds, id),
      currentChannelId: currentChannelId === id ? 1 : currentChannelId,
    };
  },
  [actions.renameChannelSuccess](state, { payload: { id, name } }) {
    const { byId, allIds, currentChannelId } = state;
    const channel = byId[id];
    const renamedChannel = { ...channel, name };
    return {
      byId: { ...byId, [id]: renamedChannel },
      allIds,
      currentChannelId,
    };
  },
}, { byId: {}, allIds: [], currentChannelId: 1 });

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

const messages = handleActions({
  [actions.updateMessagesSuccess](state) {
    return state;
  },
  [actions.getMessagesSuccess](state, { payload: { data } }) {
    return {
      byId: _.keyBy(data, 'id'),
      allIds: data.map(({ id }) => id),
    };
  },
  [actions.updateMessages](state, { payload: { data } }) {
    const { data: { attributes } } = data;
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [attributes.id]: attributes },
      allIds: [...allIds, attributes.id],
    };
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    const { byId, allIds } = state;
    return {
      byId: _.omitBy(byId, ({ channelId }) => channelId === id),
      allIds: allIds.filter(currentId => byId[currentId].channelId !== id),
    };
  },
}, { byId: {}, allIds: [] });

export default combineReducers({
  channels,
  messages,
  sendMessageState,
  modalAddChannelUIState,
  modalRemoveChannelUIState,
  modalRenameChannelUIState,
  form: formReducer,
});
