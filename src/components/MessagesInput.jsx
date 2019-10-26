import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../actions';
import UserContext from '../UserContext';

const mapStateToProps = (state) => {
  const { channels: { currentChannelId }, sendMessageState } = state;
  return { currentChannelId, sendMessageState };
};

const actionCreators = {
  sendMessage: actions.sendMessage,
};

@connect(mapStateToProps, actionCreators)
class MessagesInput extends React.Component {
  static contextType = UserContext;

  sendMessage = ({ message }) => {
    const { sendMessage, currentChannelId, reset } = this.props;
    const data = {
      author: this.context,
      message,
    };
    sendMessage(currentChannelId, data);
    reset();
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div className="row h-25">
        <div className="col message-input">
          <form onSubmit={handleSubmit(this.sendMessage)}>
            <div className="input-group mb-3">
              <Field name="message" component="input" type="text" className="form-control" placeholder="enter your message" aria-label="enter your message" aria-describedby="button-addon2" />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="submit"
                  id="button-addon2"
                  disabled={pristine || submitting}
                >
                    Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'newMessage',
})(MessagesInput);
