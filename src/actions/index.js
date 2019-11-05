import { createAction } from 'redux-actions';
import axios from 'axios';
import routes from '../routes';

export const inverseShowModalAddChannel = createAction('MODAL_ADD_CHANNEL_UI_STATE');
export const inverseShowModalRemoveChannel = createAction('MODAL_REMOVE_CHANNEL_UI_STATE');
export const inverseShowModalRenameChannel = createAction('MODAL_RENAME_CHANNEL_UI_STATE');

export const changeChannel = createAction('CHANNEL_CHANGE');

export const updateMessages = createAction('MESSAGES_UPDATE');
export const updateMessagesSuccess = createAction('MESSAGES_UPDATE_SUCCESS');

export const sendMessageRequest = createAction('MESSAGE_SEND_REQUEST');
export const sendMessageSuccess = createAction('MESSAGE_SEND_SUCCESS');
export const sendMessageFailure = createAction('MESSAGE_SEND_FAILURE');

export const sendMessage = ({ id, data }) => async (dispatch) => {
  dispatch(sendMessageRequest());
  try {
    const path = routes.channelMessagesPath(id);
    await axios.post(path, { data: { attributes: data } });
    dispatch(sendMessageSuccess());
  } catch (e) {
    dispatch(sendMessageFailure());
    throw e;
  }
};

export const addChannelRequest = createAction('CHANNEL_ADD_REQUEST');
export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCEESS');
export const addChannelFailure = createAction('CHANNEL_ADD_FAILED');
export const updateChannelNew = createAction('CHANNEL_UPDATE_NEW');

export const addChannel = ({ channel }) => async (dispatch) => {
  dispatch(addChannelRequest());
  try {
    const path = routes.channelsPath();
    await axios.post(path, { data: { attributes: { name: channel } } });
    dispatch(addChannelSuccess());
  } catch (e) {
    dispatch(addChannelFailure());
    throw e;
  }
};

export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILED');
export const updateChannelRemoved = createAction('CHANNEL_UPDATE_REMOVED');

export const removeChannel = id => async (dispatch) => {
  dispatch(removeChannelRequest());
  try {
    const path = routes.channelPath(id);
    await axios.delete(path);
    dispatch(removeChannelSuccess());
  } catch (e) {
    dispatch(removeChannelFailure());
    throw e;
  }
};

export const renameChannelRequest = createAction('CHANNEL_RENAME_REQUEST');
export const renameChannelSuccess = createAction('CHANNEL_RENAME_SUCCESS');
export const renameChannelFailure = createAction('CHANNEL_RENAME_FAILED');
export const updateChannelName = createAction('CHANNEL_UPDATE_NAME');

export const renameChannel = (id, name) => async (dispatch) => {
  dispatch(renameChannelRequest());
  try {
    const path = routes.channelPath(id);
    await axios.patch(path, { data: { attributes: { name } } });
    dispatch(renameChannelSuccess());
  } catch (e) {
    dispatch(renameChannelFailure());
    throw e;
  }
};
