import { createAction } from 'redux-actions';
import axios from 'axios';
import routes from '../routes';

export const addChannel = createAction('CHANNEL_ADD');

export const sendMessageRequest = createAction('MESSAGE_SEND_REQUEST');
export const sendMessageSuccess = createAction('MESSAGE_SEND_SUCCESS');
export const sendMessageFailure = createAction('MESSAGE_SEND_FAILURE');

export const sendMessage = (id, message) => async (dispatch) => {
  dispatch(sendMessageRequest());
  try {
    await axios.get(routes.channelMessagesPath(id), message);
    dispatch(sendMessageSuccess({ author: 'lol', message }));
  } catch (e) {
    dispatch(sendMessageFailure(e));
  }
};
