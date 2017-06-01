import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ThreadListCell from './ThreadListCell';

const styles = {
  threadWrapper: {
    overflow: 'auto',
    maxHeight: 'calc(100vh - 172px)',
    width: '100%',
  },
};

function sortThreadsByDate(threads) {
  return threads.sort((a, b) => {
    const date1 = a.lastMessage
      ? new Date(a.lastMessage.createdAt)
      : new Date(0);
    const date2 = b.lastMessage
      ? new Date(b.lastMessage.createdAt)
      : new Date(0);
    if (date1 > date2) {
      return -1;
    } else if (date1 < date2) {
      return 1;
    }
    return 0;
  });
}

class ThreadList extends Component {
  constructor(props) {
    super(props);
    this.changeThread = this.changeThread.bind(this);
  }

  componentWillMount() {
    const isThread = window.location.pathname.match(/\/thread\/([\w-]+)/);
    if (isThread && isThread[1]) {
      const threadId = isThread[1];
      if (this.props.threads.length) {
        this.showThreadMessages(threadId, this.props.token);
      }
    }
  }

  getMessageTime(time) {
    const date = new Date(time);
    const mm = date.getUTCMinutes();
    const hh = date.getHours();
    const minutes = (mm < 10) ? `0${mm}` : `${mm}`;
    return `${hh}:${minutes}`;
  }

  changeThread(thread) {
    const { changeThread, token } = this.props;
    browserHistory.push(`/main/thread/${thread._id}`);
    changeThread(thread, token);
  }

  renderThreadList() {
    const { threads } = this.props;
    return sortThreadsByDate(threads).map((thread, i) => (
      <ThreadListCell
        key={i}
        thread={thread}
        getMessageTime={this.getMessageTime}
        onClick={() => this.changeThread(thread)}
      />
    ));
  }

  render() {
    return (
      <div className="threadsWrapper" style={styles.threadWrapper}>
        <div style={{ overflowX: 'hidden' }}>
          {this.renderThreadList()}
        </div>
      </div>
    );
  }
}

ThreadList.defaultProps = {
  threads: [],
  token: '',
};

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    live: PropTypes.boolean,
  })),
  token: PropTypes.string,
  changeThread: PropTypes.func,
};

export default ThreadList;
