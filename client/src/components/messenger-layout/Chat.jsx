import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';
import io from 'socket.io-client';
import actions from '../../actions';
import ThreadTabs from './ThreadTabs';
import ChatBody from './ChatBody';

const styles = {
  chatWrapper: {
    zIndex: '1',
    display: 'flex',
    width: '100%',
  },
  chatBody: {
    maxHeight: 'calc(100vh - 98px)',
    height: 'calc(100vh - 98px)',
    flexGrow: '1',
    position: 'relative',
  },
  searchForm: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0',
  },
  searchFormWrapper: {
    width: '294px',
    display: 'flex',
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#f2f2f2',
  },
  searchFormInput: {
    border: 'none',
    flexGrow: '1',
    background: '#f2f2f2',
    padding: '5px',
    ':focus': {
      outline: 'none',
    },
  },
  searchIcon: {
    background: 'url(./assets/search-ico.png) 50% 50% no-repeat',
    width: '36px',
    height: '36px',
  },
};

class Chat extends Component {
  constructor(props) {
    super(props);
    this.showUnreadThreads = this.showUnreadThreads.bind(this);
    this.showActiveThreads = this.showActiveThreads.bind(this);
    this.assignToSelf = this.assignToSelf.bind(this);
    this.state = {
      showUnreadThreads: false,
    };
  }

  componentDidMount() {
    const {
      addMessage,
      initializeChat,
      activeThread,
    } = this.props.actions;
    const { role, id, companyId } = this.props.user;
    const socket = io.connect();

    socket.on('join namespace', (success) => {
      if (success) {
        this.socket = io.connect(`/${companyId}`);

        this.socket.on('new message', (data) => {
          const message = {
            _id: data._id,
            text: data.content,
            threadId: data.threadId,
          };
          addMessage(data.threadId, message, activeThread);
        });

        if (this.props.token) {
          const isAdmin = role === 'admin';
          initializeChat(isAdmin, this.props.token);
          if (isAdmin) {
            this.socket.emit('set-admin');
          } else {
            this.socket.emit('join', id);
          }
        }

        socket.emit('disconnect');
      }
    });

    socket.emit('join namespace', companyId);
  }

  componentWillReceiveProps(nextProps) {
    const { initializeChat } = this.props.actions;
    const { role } = this.props.user;
    if (nextProps.token && nextProps.token !== this.props.token) {
      initializeChat(role === 'admin', nextProps.token);
    }
  }

  componentWillUnmount() {
    this.socket.emit('disconnect');
  }

  showUnreadThreads() {
    this.setState({
      showUnreadThreads: true,
    });
  }

  showActiveThreads() {
    this.setState({
      showUnreadThreads: false,
    });
  }

  assignToSelf(threadId) {
    this.props.actions.assignThread(this.props.user.id, threadId, this.props.token, true);
    this.showActiveThreads();
  }

  render() {
    const {
      threads,
      token,
      messages,
      activeThread,
      user,
      messageText,
      users,
    } = this.props;
    const {
      changeThread,
      sendMessage,
      uploadFile,
      addRepToThread,
      assignThread,
      setMessageText,
    } = this.props.actions;
    let threadMessages = [];

    if (activeThread) {
      threadMessages = threads[activeThread].messages.map(id => messages[id]).filter(m => !!m);
    }

    return (
      <div className="chatWrapper" style={styles.chatWrapper}>
        <ThreadTabs
          unread={this.state.showUnreadThreads}
          showActiveThreads={this.showActiveThreads}
          showUnreadThreads={this.showUnreadThreads}
          onClick={this.showUnreadThreads}
          threads={threads}
          userId={user.id}
          changeThread={changeThread}
          token={token}
        />
        <ChatBody
          messages={threadMessages}
          sendMessage={sendMessage}
          thread={threads[activeThread] || {}}
          uploadFile={uploadFile}
          userId={user.id}
          token={token}
          messageText={messageText}
          setMessageText={setMessageText}
          users={users}
          addRepToThread={addRepToThread}
          assignToSelf={this.assignToSelf}
          assignThread={assignThread}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    threads: state.threads,
    messages: state.messages,
    token: state.auth.token,
    user: state.auth.user,
    activeThread: state.chat.activeThread,
    messageText: state.chat.messageText,
    users: state.users,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Radium(Chat));

Chat.defaultProps = {
  threads: {},
  token: '',
  user: {},
  actions: {},
  activeThread: '',
};

Chat.propTypes = {
  threads: PropTypes.object,
  messages: PropTypes.object.isRequired,
  token: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
    companyId: PropTypes.string,
  }),
  activeThread: PropTypes.string,
  messageText: PropTypes.string.isRequired,
  actions: PropTypes.objectOf(PropTypes.func),
  users: PropTypes.object.isRequired,
};
