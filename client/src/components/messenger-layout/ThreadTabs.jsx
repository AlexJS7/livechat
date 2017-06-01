import React, { PropTypes } from 'react';
import ThreadList from './ThreadList';

const styles = {
  threadList: {
    zIndex: '1',
    width: 300,
    minWidth: 250,
    height: '100%',
    background: '#fff',
    borderRight: '1px solid #e6e6e6',
  },
  tabSection: {
    width: '100%',
  },
  tabList: {
    display: 'flex',
    width: '100%',
    height: 73,
    userSelect: 'none',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
  },
  tabCell: {
    flexBasis: '50%',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textAlign: 'center',
    padding: '18px 0',
    fontSize: '16px',
    color: '#adadad',
    fontFamily: 'opensansSemiBold',
    ':hover': {
      color: '#8cc4ea',
      cursor: 'pointer',
    },
  },
  firstTabCell: {
    borderRight: '1px solid #edf0f2',
  },
  tabCellActive: {
    borderBottom: 'none',
    color: '#3598db',
  },
};

const Tab = ({ unread, showThreads, label, first }) => {
  function getStyle() {
    if ((unread && first) || (!unread && !first)) {
      return { ...styles.tabCell };
    }
    return { ...styles.tabCell, ...styles.tabCellActive };
  }

  return (
    <li
      className="activeTab"
      style={first ? { ...getStyle(), ...styles.firstTabCell } : getStyle()}
      key={1}
      onClick={showThreads}
    >
      {label}
    </li>
  );
};

const ThreadTabs = ({
  threads,
  userId,
  changeThread,
  token,
  unread,
  showActiveThreads,
  showUnreadThreads,
}) => (
  <div className="threadList" style={styles.threadList}>
    <div className="tabSection" style={styles.tabSection}>
      <ul className="tabList" style={styles.tabList}>
        <Tab unread={unread} showThreads={showActiveThreads} label="Chats" first />
        <Tab unread={unread} showThreads={showUnreadThreads} label="Unread" />
      </ul>
    </div>
    <ThreadList
      threads={Object.keys(threads)
        .map(threadId => threads[threadId])
        .filter(thread => (!unread
          ? (thread.repIds.indexOf(userId) !== -1)
          : (thread.repIds.indexOf(userId) === -1)))
      }
      changeThread={changeThread}
      token={token}
    />
  </div>
);

Tab.propTypes = {
  unread: PropTypes.bool.isRequired,
  showThreads: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
};

ThreadTabs.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.object),
  userId: PropTypes.string.isRequired,
  changeThread: PropTypes.func,
  token: PropTypes.string,
  unread: PropTypes.bool,
  showActiveThreads: PropTypes.func,
  showUnreadThreads: PropTypes.func,
};

export default ThreadTabs;
