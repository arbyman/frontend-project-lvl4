import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';

const NewChannelNameForm = (props) => {
  const {
    handleSubmit, onClick, pristine, submitting, error,
  } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Field name="name" component="input" type="text" className="form-control" aria-label="new channel name" aria-describedby="button-addon2" />
      </Form.Group>
      <ButtonToolbar>
        <Button variant="success" type="submit" disabled={pristine || submitting}>Rename channel</Button>
        <Button variant="danger" onClick={onClick}>Cancel</Button>
      </ButtonToolbar>
      {error && new SubmissionError(error)}
    </Form>
  );
};

export default reduxForm({ form: 'newChannelNameForm' })(NewChannelNameForm);
