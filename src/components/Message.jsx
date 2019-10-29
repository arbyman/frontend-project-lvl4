const Message = (props) => {
  const { text, author } = props;
  return `${author}: ${text}\n`;
};

export default Message;
