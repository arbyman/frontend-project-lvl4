import React from 'react';
import { connect } from 'react-redux';
import { ListGroup, Button } from 'react-bootstrap';
import io from 'socket.io-client';
import * as actions from '../actions';
import Channel from './Channel';
import { ModalAddChannel, ModalRenameChannel, ModalRemoveChannel } from './Modals';

const mapStateToProps = (state) => {
  const {
    channels: { byId, allIds, currentChannelId },
    modalUIState,
    addChannelState,
    removeChannelState,
    renameChannelState,
  } = state;
  const currentChannelName = byId[currentChannelId].name;
  const channels = allIds.map(id => byId[id]);
  return {
    channels,
    currentChannelId,
    currentChannelName,
    modalUIState,
    addChannelState,
    removeChannelState,
    renameChannelState,
  };
};

const actionsCreators = {
  showModalAddChannel: actions.showModalAddChannel,
  hideModal: actions.hideModal,
  addChannel: actions.addChannel,
  updateChannelNew: actions.updateChannelNew,
  renameChannel: actions.renameChannel,
  updateChannelName: actions.updateChannelName,
  removeChannel: actions.removeChannel,
  updateChannelRemoved: actions.updateChannelRemoved,
};

@connect(mapStateToProps, actionsCreators)
class Channels extends React.Component {
  componentDidMount() {
    const { updateChannelNew, updateChannelRemoved, updateChannelName } = this.props;
    const socket = io();
    socket.on('removeChannel', ({ data: { id } }) => {
      updateChannelRemoved({ id });
    });
    socket.on('renameChannel', (data) => {
      const { data: { attributes: { id, name } } } = data;
      updateChannelName({ id, name });
    });
    socket.on('newChannel', (data) => {
      const { data: { attributes: channel } } = data;
      updateChannelNew({ channel });
    });
  }

  handleAddChannel = async ({ channel }) => {
    const { addChannel, hideModal } = this.props;
    await addChannel({ channel });
    hideModal();
  }

  handleRenameChannel = id => async ({ name }) => {
    const { renameChannel, hideModal } = this.props;
    await renameChannel(id, name);
    hideModal();
  }

  handleRemoveChannel = id => async () => {
    const { removeChannel, hideModal } = this.props;
    await removeChannel(id);
    hideModal();
  }

  renderModal = () => {
    const {
      modalUIState: { activeModal },
      currentChannelId,
      currentChannelName,
      addChannelState,
      removeChannelState,
      renameChannelState,
      hideModal,
    } = this.props;
    switch (activeModal) {
      case 'addChannel':
        return (
          <ModalAddChannel
            onHide={hideModal}
            onSubmit={this.handleAddChannel}
            addChannelState={addChannelState}
          />
        );
      case 'removeChannel':
        return (
          <ModalRemoveChannel
            onHide={hideModal}
            currentChannelName={currentChannelName}
            onClick={this.handleRemoveChannel(currentChannelId)}
            removeChannelState={removeChannelState}
          />
        );
      case 'renameChannel':
        return (
          <ModalRenameChannel
            onSubmit={this.handleRenameChannel(currentChannelId)}
            onHide={hideModal}
            currentChannelName={currentChannelName}
            renameChannelState={renameChannelState}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const {
      channels,
      showModalAddChannel,
    } = this.props;
    return (
      <div className="col-3 d-flex flex-column h-100">
        <ListGroup as="ul" variant="outline-danger">
          {channels
            .map(props => (
              <Channel {...props} key={props.id} />
            ))}
        </ListGroup>
        <Button variant="outline-primary" block className="text-center add-channel mt-auto" onClick={showModalAddChannel}>
          + add channel
        </Button>
        {this.renderModal()}
      </div>
    );
  }
}

export default Channels;
