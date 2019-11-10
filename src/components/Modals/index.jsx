
import React from 'react';
import { Modal, Spinner, Button } from 'react-bootstrap';
import NewChannelForm from '../NewChannelForm';
import NewChannelNameForm from '../NewChannelNameForm';

export const ModalAddChannel = (props) => {
  const { onHide, onSubmit, addChannelState } = props;
  return (
    <Modal
      show
      onHide={onHide}
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
          onSubmit={onSubmit}
          onClick={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export const ModalRenameChannel = (props) => {
  const {
    onHide,
    onSubmit,
    renameChannelState,
    currentChannelName,
  } = props;
  return (
    <Modal
      show
      onHide={onHide}
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
          onSubmit={onSubmit}
          onClick={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export const ModalRemoveChannel = (props) => {
  const {
    onHide,
    onClick,
    currentChannelName,
    removeChannelState,
  } = props;
  return (
    <Modal
      show
      onHide={onHide}
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
        <Button variant="danger" onClick={onClick}>Delete channel</Button>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};
