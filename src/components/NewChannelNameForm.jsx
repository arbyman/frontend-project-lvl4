import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';

class NewChannelNameForm extends React.Component {
  constructor(props) {
    super(props);
    this.inputName = React.createRef();
  }

  componentWillMount() {
    const { channelName, initialize } = this.props;
    initialize({ name: channelName });
  }

  componentDidMount() {
    this.inputName.current.getRenderedComponent().select();
  }

  componentDidUpdate() {
    this.inputName.current.getRenderedComponent().focus();
  }

  render() {
    const {
      handleSubmit, onClick, pristine, submitting, error,
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Field name="name" component="input" ref={this.inputName} forwardRef type="text" className="form-control" autoFocus aria-label="new channel name" aria-describedby="button-addon2" />
        </Form.Group>
        <ButtonToolbar>
          <Button variant="success" type="submit" disabled={pristine || submitting}>Rename channel</Button>
          <Button variant="danger" onClick={onClick}>Cancel</Button>
        </ButtonToolbar>
        {error && new SubmissionError(error)}
      </Form>
    );
  }
}

export default reduxForm({ form: 'newChannelNameForm' })(NewChannelNameForm);
