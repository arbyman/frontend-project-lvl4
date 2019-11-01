import React from 'react';
import { connect } from 'react-redux';
import {
  ListGroup, Button, Modal, Form, ButtonToolbar, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import io from 'socket.io-client';
import * as actions from '../actions';

const mapStateToProps = (state) => {
  const {
    channels: { byId, allIds, currentChannelId },
    modalAddChannelUIState,
    modalRemoveChannelUIState,
    modalRenameChannelUIState,
  } = state;
  const channels = allIds.map(id => byId[id]);
  return {
    channels,
    currentChannelId,
    modalAddChannelUIState,
    modalRemoveChannelUIState,
    modalRenameChannelUIState,
  };
};

const actionsCreators = {
  inverseShowModalAddChannel: actions.inverseShowModalAddChannel,
  inverseShowModalRemoveChannel: actions.inverseShowModalRemoveChannel,
  inverseShowModalRenameChannel: actions.inverseShowModalRenameChannel,
  changeChannel: actions.changeChannel,
  addChannel: actions.addChannel,
  removeChannelSuccess: actions.removeChannelSuccess,
  removeChannel: actions.removeChannel,
  renameChannel: actions.renameChannel,
  renameChannelSuccess: actions.renameChannelSuccess,
};

@connect(mapStateToProps, actionsCreators)
class Channels extends React.Component {
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

  handleAddChannel = async ({ channel }) => {
    const { addChannel, inverseShowModalAddChannel, reset } = this.props;
    await addChannel({ channel });
    reset();
    inverseShowModalAddChannel();
  }

  handleRemoveChannel = id => async () => {
    const { removeChannel, inverseShowModalRemoveChannel, reset } = this.props;
    await removeChannel(id);
    inverseShowModalRemoveChannel();
    reset();
  }

  handleRenameChannel = id => async ({ name }) => {
    const { renameChannel, inverseShowModalRenameChannel, reset } = this.props;
    await renameChannel(id, name);
    inverseShowModalRenameChannel();
    reset();
  }

  handleShowModalAddChannel = () => {
    const { inverseShowModalAddChannel, reset } = this.props;
    reset();
    inverseShowModalAddChannel();
  }

  handleShowModalRemoveChannel = () => {
    const { inverseShowModalRemoveChannel, reset } = this.props;
    inverseShowModalRemoveChannel();
    reset();
  }

  handleShowModalRenameChannel = () => {
    const { inverseShowModalRenameChannel, reset } = this.props;
    inverseShowModalRenameChannel();
    reset();
  }

  renderChannels(channels) {
    const {
      currentChannelId,
      modalRemoveChannelUIState,
      modalRenameChannelUIState,
      handleSubmit,
      pristine,
      submitting,
    } = this.props;
    return channels.map(({ name, id, removable }) => (
      <React.Fragment key={id}>
        <Dropdown as={ButtonGroup}>
          <ListGroup.Item
            action
            active={currentChannelId === id}
            onClick={this.handleChangeChannel(id)}
          >
            {name}
          </ListGroup.Item>
          <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
          <Dropdown.Menu>
            <Dropdown.Item onClick={this.handleShowModalRenameChannel}>Rename</Dropdown.Item>
            {removable && (
            <Dropdown.Item onClick={this.handleShowModalRemoveChannel}>
              Delete
            </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <Modal
          show={modalRemoveChannelUIState === 'open'}
          onHide={this.handleShowModalRemoveChannel}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            {<Modal.Title>{name}</Modal.Title>}
          </Modal.Header>
          <Modal.Body>
            <p>This channel will be deleted. Are you sure?</p>
            <Form onSubmit={handleSubmit(this.handleRemoveChannel(id))}>
              <ButtonToolbar>
                <Button variant="danger" type="submit">Delete channel</Button>
                <Button variant="secondary" onClick={this.handleShowModalRemoveChannel}>Cancel</Button>
              </ButtonToolbar>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal
          show={modalRenameChannelUIState === 'open'}
          onHide={this.handleShowModalRenameChannel}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <Form onSubmit={handleSubmit(this.handleRenameChannel(id))}>
              <Form.Group>
                <Form.Label>Write a new channel name.</Form.Label>
                <Field name="name" component="input" type="text" className="form-control" placeholder="new channel name" aria-label="new channel name" aria-describedby="button-addon2" />
              </Form.Group>
              <ButtonToolbar>
                <Button variant="success" type="submit" disabled={pristine || submitting}>Rename channel</Button>
                <Button variant="danger" onClick={this.handleShowModalRenameChannel}>Cancel</Button>
              </ButtonToolbar>
            </Form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    ));
  }

  render() {
    const {
      channels,
      modalAddChannelUIState,
      handleSubmit,
      pristine,
      submitting,
    } = this.props;
    return (
      <div className="col-3">
        <ListGroup as="ul" variant="outline-danger">
          {this.renderChannels(channels)}
        </ListGroup>
        <Button variant="outline-primary" block className="text-center add-channel" onClick={this.handleShowModalAddChannel}>
          + add channel
        </Button>
        <Modal
          show={modalAddChannelUIState === 'open'}
          onHide={this.handleShowModalAddChannel}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <Form onSubmit={handleSubmit(this.handleAddChannel)}>
              <Form.Group>
                <Form.Label>Add new channel</Form.Label>
                <Field name="channel" component="input" type="text" className="form-control" placeholder="new channel" aria-label="new channel" aria-describedby="button-addon2" />
              </Form.Group>
              <ButtonToolbar>
                <Button variant="success" type="submit" disabled={pristine || submitting}>Add channel</Button>
                <Button variant="danger" onClick={this.handleShowModalAddChannel}>Cancel</Button>
              </ButtonToolbar>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default reduxForm({
  form: 'newChannel',
})(Channels);
