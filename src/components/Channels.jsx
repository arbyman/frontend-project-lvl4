import React from 'react';
import { connect } from 'react-redux';
import { ListGroup, Button, Modal } from 'react-bootstrap';
import io from 'socket.io-client';
import * as actions from '../actions';
import Channel from './Channel';
import NewChannelForm from './NewChannelForm';
import NewChannelNameForm from './NewChannelNameForm';

const mapStateToProps = (state) => {
  const {
    channels: { byId, allIds, currentChannelId },
    modalAddChannelUIState,
    modalRenameChannelUIState,
    modalRemoveChannelUIState,
  } = state;
  const currentChannelName = byId[currentChannelId].name;
  const channels = allIds.map(id => byId[id]);
  return {
    channels,
    currentChannelId,
    currentChannelName,
    modalAddChannelUIState,
    modalRenameChannelUIState,
    modalRemoveChannelUIState,
  };
};

const actionsCreators = {
  inverseShowModalAddChannel: actions.inverseShowModalAddChannel,
  inverseShowModalRenameChannel: actions.inverseShowModalRenameChannel,
  inverseShowModalRemoveChannel: actions.inverseShowModalRemoveChannel,
  addChannel: actions.addChannel,
  addChannelSuccess: actions.addChannelSuccess,
  renameChannel: actions.renameChannel,
  renameChannelSuccess: actions.renameChannelSuccess,
  removeChannel: actions.removeChannel,
  removeChannelSuccess: actions.removeChannelSuccess,
};

@connect(mapStateToProps, actionsCreators)
class Channels extends React.Component {
  componentDidMount() {
    const { addChannelSuccess, removeChannelSuccess, renameChannelSuccess } = this.props;
    const socket = io();
    socket.on('removeChannel', ({ data: { id } }) => {
      removeChannelSuccess({ id });
    });
    socket.on('renameChannel', (data) => {
      const { data: { attributes: { id, name } } } = data;
      renameChannelSuccess({ id, name });
    });
    socket.on('newChannel', (data) => {
      const { data: { attributes: channel } } = data;
      addChannelSuccess({ channel });
    });
  }

  handleAddChannel = async ({ channel }) => {
    const { addChannel, inverseShowModalAddChannel } = this.props;
    await addChannel({ channel });
    inverseShowModalAddChannel();
  }

  handleRenameChannel = id => async ({ name }) => {
    const { renameChannel, inverseShowModalRenameChannel } = this.props;
    await renameChannel(id, name);
    inverseShowModalRenameChannel();
  }

  handleRemoveChannel = id => async () => {
    const { removeChannel, inverseShowModalRemoveChannel } = this.props;
    await removeChannel(id);
    inverseShowModalRemoveChannel();
  }

  render() {
    const {
      channels,
      currentChannelId,
      currentChannelName,
      inverseShowModalAddChannel,
      inverseShowModalRenameChannel,
      inverseShowModalRemoveChannel,
      modalRenameChannelUIState,
      modalRemoveChannelUIState,
      modalAddChannelUIState,
    } = this.props;
    return (
      <div className="col-3">
        <ListGroup as="ul" variant="outline-danger">
          {channels
            .map(props => (
              <Channel {...props} key={props.id} />
            ))}
        </ListGroup>
        <Button variant="outline-primary" block className="text-center add-channel" onClick={inverseShowModalAddChannel}>
          + add channel
        </Button>
        <Modal
          show={modalAddChannelUIState === 'open'}
          onHide={inverseShowModalAddChannel}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add new channel.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NewChannelForm
              onSubmit={this.handleAddChannel}
              onClick={inverseShowModalAddChannel}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={modalRenameChannelUIState === 'open'}
          onHide={inverseShowModalRenameChannel}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Write a new channel name.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NewChannelNameForm
              channelName={currentChannelName}
              onSubmit={this.handleRenameChannel(currentChannelId)}
              onClick={inverseShowModalRenameChannel}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={modalRemoveChannelUIState === 'open'}
          onHide={inverseShowModalRemoveChannel}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            {<Modal.Title>{currentChannelName}</Modal.Title>}
          </Modal.Header>
          <Modal.Body>
            <p>This channel will be deleted. Are you sure?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.handleRemoveChannel(currentChannelId)}>Delete channel</Button>
            <Button variant="secondary" onClick={inverseShowModalRemoveChannel}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Channels;
