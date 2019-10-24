import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

const mapStateToProps = (state) => {
  const { channels: { byId, allIds, currentChannelId } } = state;
  const channels = allIds.map(id => byId[id]);
  return { channels, currentChannelId };
};

@connect(mapStateToProps)
class Channels extends React.Component {
  renderChannels(channels) {
    const { currentChannelId } = this.props;
    return channels.map(({ name, id }) => {
      const classes = {
        'list-group-item': true,
        active: currentChannelId === id,
      };
      return <li className={cn(classes)} key={id}>{name}</li>;
    });
  }

  render() {
    const { channels } = this.props;
    return (
      <div className="col-3">
        <ul className="list-group">
          {this.renderChannels(channels)}
        </ul>
      </div>
    );
  }
}

export default Channels;
