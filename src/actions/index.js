import { createAction } from 'redux-actions';
import axios from 'axios';
import routes from '../routes';

export const inverseShowModalAddChannel = createAction('MODAL_ADD_CHANNEL_UI_STATE');
export const inverseShowModalRemoveChannel = createAction('MODAL_REMOVE_CHANNEL_UI_STATE');
export const inverseShowModalRenameChannel = createAction('MODAL_RENAME_CHANNEL_UI_STATE');

export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');

export const changeChannel = createAction('CHANNEL_CHANGE');

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

export const addChannel = ({ channel }) => async (dispatch) => {
  try {
    const path = routes.channelsPath();
    const { data } = await axios.post(path, { data: { attributes: { name: channel } } });
    dispatch(addChannelSuccess({ data }));
  } catch (e) {
    throw e;
  }
};

export const getMessagesRequest = createAction('MESSAGES_GET_REQUEST');
export const getMessagesSuccess = createAction('MESSAGES_GET_SUCCESS');
export const getMessagesFailure = createAction('MESSAGES_GET_FAILURE');

export const getMessages = id => async (dispatch) => {
  dispatch(getMessagesRequest());
  try {
    const path = routes.channelMessagesPath(id);
    const { data } = await axios.get(path);
    dispatch(getMessagesSuccess({ data }));
  } catch (e) {
    dispatch(getMessagesFailure());
    throw e;
  }
};

export const removeChannel = id => async () => {
  try {
    const path = routes.channelPath(id);
    await axios.delete(path);
  } catch (e) {
    throw e;
  }
};

export const renameChannel = (id, name) => async () => {
  console.log(id);
  try {
    const path = routes.channelPath(id);
    await axios.patch(path, { data: { attributes: { name } } });
  } catch (e) {
    throw e;
  }
};
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const renameChannelSuccess = createAction('CHANNEL_RENAME_SUCCESS');
export const updateMessages = createAction('MESSAGES_UPDATE');
export const updateMessagesSuccess = createAction('MESSAGES_UPDATE_SUCCESS');
