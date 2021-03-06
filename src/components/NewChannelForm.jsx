import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import connect from '../connect';

const mapStateToProps = state => state;

@connect(mapStateToProps)
class NewChannelForm extends React.Component {
  constructor(props) {
    super(props);
    this.inputChannelName = React.createRef();
  }

  componentDidUpdate() {
    this.inputChannelName.current.getRenderedComponent().focus();
  }

  render() {
    const {
      handleSubmit, pristine, submitting, onClick,
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Field name="channel" ref={this.inputChannelName} forwardRef component="input" type="text" className="form-control" placeholder="new channel" aria-label="new channel" aria-describedby="button-addon2" />
        </Form.Group>
        <ButtonToolbar>
          <Button variant="success" type="submit" disabled={pristine || submitting}>Add channel</Button>
          <Button variant="danger" onClick={onClick}>Cancel</Button>
        </ButtonToolbar>
      </Form>
    );
  }
}

export default reduxForm({ form: 'newChannelForm' })(NewChannelForm);
