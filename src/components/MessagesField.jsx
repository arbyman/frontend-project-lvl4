import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as actions from '../actions';

const mapStateToProps = (state) => {
  const { messages: { byId, allIds }, channels: { currentChannelId } } = state;
  const messages = allIds
    .map(id => byId[id])
    .map(({ attributes }) => `${attributes.author}: ${attributes.message}`);
  return { messages, currentChannelId };
};

const actionCreators = {
  updateMessages: actions.updateMessages,
  getMessages: actions.getMessages,
};

@connect(mapStateToProps, actionCreators)
class MessagesField extends React.Component {
  constructor(props) {
    super(props);
    this.textField = React.createRef();
  }

  componentDidMount() {
    const { getMessages, updateMessages, currentChannelId } = this.props;
    getMessages(currentChannelId);
    const socket = io();
    socket.on('newMessage', data => updateMessages({ data }));
  }

  componentDidUpdate() {
    this.textField.current.scrollTop = this.textField.current.scrollHeight;
  }

  render() {
    const { messages } = this.props;
    return (
      <div className="row message-field">
        <div className="col">
          <textarea ref={this.textField} className="text-field form-control h-100" disabled value={messages.join('\n')} />
        </div>
      </div>
    );
  }
}

export default MessagesField;
