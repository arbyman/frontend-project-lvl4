import React from 'react';

export default class Chat extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="row h-100">
        {children}
      </div>
    );
  }
}
