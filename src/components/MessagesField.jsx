import React from 'react';

export default class MessagesField extends React.Component {
  render() {
    return (
      <div className="row message-field">
        <div className="col">
          <textarea className="text-field form-control h-100" disabled />
        </div>
      </div>
    );
  }
}
