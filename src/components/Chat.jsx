import React from 'react';
import Channels from './Channels';
import MessagesField from './MessagesField';
import MessagesInput from './MessagesInput';


const Chat = () => (
  <div className="row h-100">
    <Channels />
    <div className="col-9">
      <MessagesField />
      <MessagesInput />
    </div>
  </div>
);

export default Chat;
