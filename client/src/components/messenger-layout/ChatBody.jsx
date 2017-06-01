import React, { PropTypes } from 'react';

import ChatBodyHeader from './ChatBodyHeader';
import DropzoneOverlay from './DropzoneOverlay';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

const styles = {
  chatContainer: {
    maxHeight: 'calc(100vh - 98px)',
    height: 'calc(100vh - 98px)',
    position: 'relative',
    minWidth: '450px',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
};

const ChatBody = ({
  userId,
  users,
  messages,
  thread,
  sendMessage,
  uploadFile,
  messageText,
  setMessageText,
  token,
  addRepToThread,
  assignThread,
  assignToSelf,
}) => ((thread && thread._id) ? (
  <div className="chatContainer" style={styles.chatContainer}>
    <ChatBodyHeader
      users={users}
      addRepToThread={addRepToThread}
      assignThread={assignThread}
      assignToSelf={assignToSelf}
      threadId={thread._id}
      threadName={thread.name}
      userId={userId}
      repIds={thread.repIds}
      token={token}
      undreadThread={thread.repIds.indexOf(userId) === -1}
    />
    {/* TODO: fix scroll issue to reenable
    <DropzoneOverlay
      activeThreadId={thread._id}
      uploadFile={uploadFile}
    /> */}
    <MessageList messages={messages} userId={userId} />
    <MessageInput
      hide={thread.repIds.indexOf(userId) === -1}
      messageText={messageText}
      setMessageText={setMessageText}
      thread={thread}
      sendMessage={sendMessage}
      userId={userId}
      token={token}
    />
  </div>
) : (
  <div className="chatContainer" style={styles.chatContainer} />
));

ChatBody.defaultProps = {
  thread: {},
  messages: [],
  sendMessage: () => {},
  uploadFile: () => {},
  token: '',
  userId: '',
};

ChatBody.propTypes = {
  thread: PropTypes.shape({
    _id: PropTypes.string,
    live: PropTypes.boolean,
    name: PropTypes.string,
  }),
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    threadId: PropTypes.string,
    text: PropTypes.string,
  })),
  sendMessage: PropTypes.func,
  messageText: PropTypes.string.isRequired,
  setMessageText: PropTypes.func.isRequired,
  uploadFile: PropTypes.func,
  addRepToThread: PropTypes.func.isRequired,
  assignThread: PropTypes.func.isRequired,
  assignToSelf: PropTypes.func.isRequired,
  token: PropTypes.string,
  userId: PropTypes.string,
  users: PropTypes.object.isRequired,
};

export default ChatBody;
