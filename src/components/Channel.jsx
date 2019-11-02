import React from 'react';
import { connect } from 'react-redux';
import {
  ListGroup, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import io from 'socket.io-client';
import * as actions from '../actions';

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

const actionsCreators = {
  inverseShowModalRemoveChannel: actions.inverseShowModalRemoveChannel,
  inverseShowModalRenameChannel: actions.inverseShowModalRenameChannel,
  changeChannel: actions.changeChannel,
  removeChannel: actions.removeChannel,
  renameChannel: actions.renameChannel,
  removeChannelSuccess: actions.removeChannelSuccess,
  renameChannelSuccess: actions.renameChannelSuccess,
};

@connect(mapStateToProps, actionsCreators)
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


  handleRemoveChannel = id => async () => {
    const { removeChannel, inverseShowModalRemoveChannel, reset } = this.props;
    await removeChannel(id);
    inverseShowModalRemoveChannel();
    reset();
  }

  handleRenameChannel = id => async ({ name }) => {
    const { renameChannel, inverseShowModalRenameChannel } = this.props;
    await renameChannel(id, name);
    inverseShowModalRenameChannel();
  }

  handleShowModalRemoveChannel = () => {
    const { inverseShowModalRemoveChannel } = this.props;
    inverseShowModalRemoveChannel();
  }

  handleShowModalRenameChannel = () => {
    const { inverseShowModalRenameChannel } = this.props;
    inverseShowModalRenameChannel();
  }

  render() {
    const {
      currentChannelId,
      inverseShowModalRenameChannel,
      inverseShowModalRemoveChannel,
      name,
      id,
      removable,
    } = this.props;
    return (
      <React.Fragment key={id}>
        <Dropdown as={ButtonGroup}>
          <ListGroup.Item
            action
            active={currentChannelId === id}
            onClick={this.handleChangeChannel(id)}
          >
            {name}
          </ListGroup.Item>
          {currentChannelId === id && <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />}
          <Dropdown.Menu>
            <Dropdown.Item onClick={inverseShowModalRenameChannel}>Rename</Dropdown.Item>
            {removable && (
            <Dropdown.Item onClick={inverseShowModalRemoveChannel}>
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
