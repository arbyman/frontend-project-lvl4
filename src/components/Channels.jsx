import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import connect from '../connect';
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

@connect(mapStateToProps)
class Channels extends React.Component {
  handleAddChannel = async ({ channel }) => {
    const { addChannel } = this.props;
    await addChannel({ channel });
  }

  handleRenameChannel = id => async ({ name }) => {
    const { renameChannel } = this.props;
    await renameChannel(id, name);
  }

  handleRemoveChannel = id => async () => {
    const { removeChannel } = this.props;
    await removeChannel(id);
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
