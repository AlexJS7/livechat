import React, { PropTypes } from 'react';
import Radium from 'radium';

const styles = {
  threadCell: {
    height: 93,
    width: '100%',
    display: 'flex',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#f5f4f4',
    },
  },
  active: {
    backgroundColor: '#f5f4f4',
  },
  avatarWrapper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 15,
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
  },
  threadInfo: {
    width: '100%',
  },
  threadName: {
    marginTop: 20,
  },
  lastMessageWrapper: {
    fontSize: '12px',
  },
  lastMessage: {
    paddingTop: 3,
    color: '#adadad',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  timeWrapper: {
    width: 50,
    marginTop: 20,
    marginRight: 15,
  },
  msgTime: {
    fontSize: '12px',
  },
  messageIndicator: {
    fontSize: '12px',
    width: '20px',
    height: '20px',
    position: 'absolute',
    top: '-5px',
    right: '12px',
    background: '#3598db',
    color: '#fff',
    textAlign: 'center',
    padding: '1px 0',
    borderRadius: '50%',
    fontFamily: 'latoBold',
  },
};

// TODO: set thread as active when open
const ThreadListCell = ({ onClick, thread, getMessageTime }) => (
  <div id={`thread${thread._id}`} style={styles.threadCell} onClick={onClick}>
    {/* {console.log('CHECKPOINT BERQ', thread)} */}
    <div style={styles.avatarWrapper}>
      <img
        src={`https://s3-eu-west-1.amazonaws.com/interactbot/public/live-chat-profile-pics/${thread.img}.png`}
        alt="User Avatar"
        style={styles.avatar}
      />
    </div>
    <div className="threadInfo" style={styles.threadInfo}>
      <div className="threadName" style={styles.threadName}>
        <strong>{thread.name}</strong>
      </div>
      <div className="lastMessageWrapper" style={styles.lastMessageWrapper}>
        <div className="lastMessage" style={styles.lastMessage}>
          { (thread.lastMessage && thread.lastMessage.text) ? thread.lastMessage.text : 'empty' }
        </div>
      </div>
    </div>
    <div className="timeWrapper" style={styles.timeWrapper}>
      <div className="msgTime" style={styles.msgTime}>
        { (!thread.lastMessage || !thread.lastMessage.createdAt)
          ? null
          : getMessageTime(thread.lastMessage.createdAt) }
      </div>
      {/* {thread.unseenMessages
        ? (<div className="messageIndicator">
          <span style={styles.messageIndicator}>{thread.unseenMessages}</span>
        </div>)
        : null} */}
      <div className="messageIndicator">
        <span style={styles.messageIndicator}>{thread.unseenMessages}</span>
      </div>
    </div>
  </div>
);

// const ThreadListCell = ({ onClick, thread, getMessageTime }) => (
//   <div style={styles.threadCell} onClick={onClick}>
//     <div className="threadAvatarWrapper" style={styles.threadAvatarWrapper}>
//       <img
//         src={`https://s3-eu-west-1.amazonaws.com/interactbot/public/live-chat-profile-pics/${thread.img}.png`}
//         alt="threadPic"
//         style={styles.threadAvatarImg}
//       />
//       {thread.unseenMessages
//         ? (<div className="messageIndicator">
//           <span style={styles.messageIndicator}>{thread.unseenMessages}</span>
//         </div>)
//         : null}
//     </div>
//     <div className="threadInfo" style={styles.threadInfo}>
//       <div className="threadName" style={styles.threadName}>
//         <strong>{thread.name}</strong>
//       </div>
//       <div className="threadTime" style={styles.threadTime}>
//         <time className="msgTime" style={styles.msgTime}>
//           { (!thread.lastMessage || !thread.lastMessage.createdAt)
//             ? null
//             : getMessageTime(thread.lastMessage.createdAt) }
//         </time>
//       </div>
//       <div className="threadLastMessageWrapper" style={styles.threadLastMessageWrapper}>
//         <p className="threadLastMessage" style={styles.threadLastMessage}>
//           { (!thread.lastMessage || !thread.lastMessage.text) ? 'empty' : thread.lastMessage.text }
//         </p>
//       </div>
//     </div>
//   </div>
// );

ThreadListCell.propTypes = {
  thread: PropTypes.object,
  getMessageTime: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Radium(ThreadListCell);
