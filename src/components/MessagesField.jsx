import React from 'react';
import io from 'socket.io-client';
import connect from '../connect';
import Message from './Message';

const mapStateToProps = (state) => {
  const { messages: { byId, allIds }, channels: { currentChannelId } } = state;
  const messages = allIds
    .map(id => byId[id])
    .filter(({ channelId }) => channelId === currentChannelId);
  return { messages, currentChannelId };
};

@connect(mapStateToProps)
class MessagesField extends React.Component {
  constructor(props) {
    super(props);
    this.textField = React.createRef();
  }

  componentDidMount() {
    const { updateMessages } = this.props;
    const socket = io();
    socket.on('newMessage', (data) => {
      const { currentChannelId } = this.props;
      const { data: { attributes: message } } = data;
      const { channelId } = message;
      const unread = currentChannelId !== channelId;
      const newMessage = { ...message, unread };
      updateMessages({ message: newMessage });
    });
  }

  componentDidUpdate() {
    this.textField.current.scrollTop = this.textField.current.scrollHeight;
  }

  render() {
    const { messages } = this.props;
    return (
      <div className="row h-100">
        <div className="col h-100">
          <div ref={this.textField} className="form-control h-100 overflow-auto mh-100">
            {messages.map(props => <Message {...props} key={props.id} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default MessagesField;
