// import _ from 'lodash';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash';
import * as actions from '../actions';

const channels = handleActions({
  [actions.addChannelSuccess](state, { payload: { data } }) {
    const { data: { attributes } } = data;
    const { byId, allIds, currentChannelId } = state;
    return {
      byId: { ...byId, [attributes.id]: attributes },
      allIds: [...allIds, attributes.id],
      currentChannelId,
    };
  },
  [actions.changeChannel](state, { payload: { id } }) {
    return { ...state, currentChannelId: id };
  },
}, { byId: {}, allIds: [], currentChannelId: 1 });

const modalAddChannelUIState = handleActions({
  [actions.inverseShowModalAddChannel](state) {
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
}, { byId: {}, allIds: [] });

export default combineReducers({
  channels,
  messages,
  sendMessageState,
  modalAddChannelUIState,
  form: formReducer,
});
