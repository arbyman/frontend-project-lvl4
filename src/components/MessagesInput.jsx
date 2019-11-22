import React from 'react';
import { Field, reduxForm } from 'redux-form';
import connect from '../connect';
import UserContext from '../UserContext';

const mapStateToProps = (state) => {
  const { channels: { currentChannelId }, sendMessageState } = state;
  return { currentChannelId, sendMessageState };
};

@connect(mapStateToProps)
class MessagesInput extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.inputMessage = React.createRef();
  }

  async componentDidMount() {
    this.inputMessage.current.getRenderedComponent().focus();
  }

  sendMessage = async ({ message }) => {
    const { sendMessage, currentChannelId, reset } = this.props;
    const data = {
      author: this.context,
      message,
    };
    await sendMessage({ id: currentChannelId, data });
    reset();
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      sendMessageState,
    } = this.props;
    return (
      <div className="row h-25">
        <div className="col message-input">
          <form onSubmit={handleSubmit(this.sendMessage)}>
            <div className="input-group mb-3">
              <Field
                name="message"
                component="input"
                ref={this.inputMessage}
                forwardRef
                type="text"
                className="form-control"
                placeholder="enter your message"
                aria-label="enter your message"
                aria-describedby="button-addon2"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="submit"
                  id="button-addon2"
                  disabled={pristine || submitting}
                >
                  {sendMessageState === 'requested' ? 'sending...' : 'Send'}
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
