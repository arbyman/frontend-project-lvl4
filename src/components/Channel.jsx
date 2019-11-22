import React from 'react';
import {
  ListGroup, Dropdown, ButtonGroup, Badge,
} from 'react-bootstrap';
import io from 'socket.io-client';
import connect from '../connect';

const mapStateToProps = (state) => {
  const {
    channels: { currentChannelId },
    modalRemoveChannelUIState,
    modalRenameChannelUIState,
  } = state;
  return {
    currentChannelId,
    modalRemoveChannelUIState,
    modalRenameChannelUIState,
  };
};

@connect(mapStateToProps)
class Channel extends React.Component {
  componentDidMount() {
    const { removeChannelSuccess, renameChannelSuccess } = this.props;
    const socket = io();
    socket.on('removeChannel', ({ data: { id } }) => {
      removeChannelSuccess({ id });
    });
    socket.on('renameChannel', (data) => {
      const { data: { attributes: { id, name } } } = data;
      renameChannelSuccess({ id, name });
    });
  }

  handleChangeChannel = id => () => {
    const { changeChannel } = this.props;
    changeChannel({ id });
  }

  render() {
    const {
      currentChannelId,
      showModalRenameChannel,
      showModalRemoveChannel,
      name,
      id,
      removable,
      unreadMessagesCount,
    } = this.props;
    return (
      <React.Fragment key={id}>
        <Dropdown as={ButtonGroup}>
          <ListGroup.Item
            action
            active={currentChannelId === id}
            onClick={this.handleChangeChannel(id)}
          >
            <h6>
              {name}
              {!!unreadMessagesCount && (
                <Badge pill variant="success" className="ml-1">{unreadMessagesCount}</Badge>
              )}
            </h6>
          </ListGroup.Item>
          {currentChannelId === id && <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />}
          <Dropdown.Menu>
            <Dropdown.Item onClick={showModalRenameChannel}>Rename</Dropdown.Item>
            {removable && (
            <Dropdown.Item onClick={showModalRemoveChannel}>
              Delete
            </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default Channel;
