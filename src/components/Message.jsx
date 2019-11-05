import React from 'react';
import moment from 'moment';

const Message = (props) => {
  const { message, author, date } = props;
  const dateFormat = moment(date).format('LTS');
  const text = `[${dateFormat}] ${author}: ${message}`;
  return (
    <div>{text}</div>
  );
};

export default Message;
