import { createAction } from 'redux-actions';
import axios from 'axios';
import routes from '../routes';

export const addChannel = createAction('CHANNEL_ADD');

export const sendMessageRequest = createAction('MESSAGE_SEND_REQUEST');
export const sendMessageSuccess = createAction('MESSAGE_SEND_SUCCESS');
export const sendMessageFailure = createAction('MESSAGE_SEND_FAILURE');

export const sendMessage = (id, data) => async (dispatch) => {
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

export const updateMessages = createAction('MESSAGES_UPDATE');
export const updateMessagesSuccess = createAction('MESSAGES_UPDATE_SUCCESS');
