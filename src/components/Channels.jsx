import React from 'react';
import { connect } from 'react-redux';
import {
  ListGroup, Button, Modal, Form, ButtonToolbar,
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../actions';

const mapStateToProps = (state) => {
  const { channels: { byId, allIds, currentChannelId }, modalAddChannelUIState } = state;
  const channels = allIds.map(id => byId[id]);
  return { channels, currentChannelId, modalAddChannelUIState };
};

const actionsCreators = {
  inverseShowModalAddChannel: actions.inverseShowModalAddChannel,
  changeChannel: actions.changeChannel,
  addChannel: actions.addChannel,
  removeChannel: actions.removeChannel,
};

@connect(mapStateToProps, actionsCreators)
class Channels extends React.Component {
  handleChangeChannel = id => () => {
    const { changeChannel } = this.props;
    changeChannel({ id });
  }

  handleRemoveChannel = id => () => {
    const { removeChannel } = this.props;
    removeChannel({ id });
  }

  handleShowModal = () => {
    const { inverseShowModalAddChannel, reset } = this.props;
    reset();
    inverseShowModalAddChannel();
  }

  handleAddChannel = async ({ channel }) => {
    const { addChannel, inverseShowModalAddChannel, reset } = this.props;
    await addChannel({ channel });
    reset();
    inverseShowModalAddChannel();
  }

  renderChannels(channels) {
    const { currentChannelId } = this.props;
    return channels.map(({ name, id }) => (
      <ListGroup.Item
        action
        active={currentChannelId === id}
        key={id}
        onClick={this.handleChangeChannel(id)}
      >
        {name}
      </ListGroup.Item>
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
        <Button variant="outline-primary" block className="text-center add-channel" onClick={this.handleShowModal}>
          + add channel
        </Button>
        <Modal
          show={modalAddChannelUIState === 'open'}
          onHide={this.handleShowModal}
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
                <Button variant="danger" onClick={this.handleShowModal}>Cancel</Button>
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
