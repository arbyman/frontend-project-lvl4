import React from 'react';

export default class MessagesInput extends React.Component {
  render() {
    return (
      <div className="row h-25">
        <div className="col message-input">
          <form>
            <input type="text" className="form-control" />
          </form>
        </div>
      </div>
    );
  }
}
