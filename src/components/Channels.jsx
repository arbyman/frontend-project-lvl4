import React from 'react';
import { connect } from 'react-redux';
import {
  ListGroup, Button, Modal, Spinner,
} from 'react-bootstrap';
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
    modalAddChannelUIState,
    modalRenameChannelUIState,
    modalRemoveChannelUIState,
    addChannelState,
    removeChannelState,
    renameChannelState,
  };
};

const actionsCreators = {
  inverseShowModalAddChannel: actions.inverseShowModalAddChannel,
  inverseShowModalRenameChannel: actions.inverseShowModalRenameChannel,
  inverseShowModalRemoveChannel: actions.inverseShowModalRemoveChannel,
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
      addChannelState,
      removeChannelState,
      renameChannelState,
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
            {addChannelState === 'requested' && (
            <div className="row d-flex justify-content-center" style={{ marginBottom: '20px' }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            )}
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
            {renameChannelState === 'requested' && (
            <div className="row d-flex justify-content-center" style={{ marginBottom: '20px' }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            )}
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
            {removeChannelState === 'requested' && (
            <div className="row d-flex justify-content-center" style={{ marginBottom: '20px' }}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            )}
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
