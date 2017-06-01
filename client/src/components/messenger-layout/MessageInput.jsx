import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { FaPaperPlane, FaSmileO } from 'react-icons/lib/fa';
import EmojiPicker from './EmojiPicker';

const styles = {
  messageInputWrapper: {
    bottom: '0',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: '90px',
    zIndex: '11',
    minWidth: '450px',
  },
  messageInputForm: {
    width: '100%',
    padding: '0 77px 0 70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newMessage: {
    display: 'flex',
    maxWidth: 450,
    flexGrow: '1',
    margin: '0 20px',
  },
  newMessageInput: {
    background: '#f2f2f2',
    boxSizing: 'border-box',
    border: 'none',
    padding: '0 10px',
    borderRadius: '18px 0 0 18px',
    height: '36px',
    lineHeight: '36px',
    flexGrow: '1',
    resize: 'none',
    overflow: 'hidden',
    outline: 'none',
    ':focus': {
      outline: 'none',
    },
  },
  emojiBtn: {
    border: 'none',
    background: '#f2f2f2',
    borderRadius: '0 18px 18px 0',
    height: '36px',
    width: '36px',
    padding: '6px',
    outline: 'none',
    ':hover': {
      cursor: 'pointer',
      background: '#e5e5e5',
    },
    userSelect: 'none',
  },
  submitMessage: {
    width: 20,
    height: 20,
    backgroundColor: '#7e7e7f',
    borderRadius: 100,
    borderWidth: 7,
    borderStyle: 'solid',
    borderColor: '#7e7e7f',
    boxSizing: 'content-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
};

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.sendMsgOnEnter = this.sendMsgOnEnter.bind(this);
    this.handleShowEmoji = this.handleShowEmoji.bind(this);
    this.state = {
      showEmoji: false,
    };
  }

  addEmoji(em) {
    this.props.setMessageText(this.props.messageText += em.native);
  }

  sendMsgOnEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.handleSendMessage(e);
    }
  }

  handleSendMessage(e) {
    e.preventDefault();
    const { thread, sendMessage, token, userId } = this.props;
    const text = this.props.messageText;
    if (text.length > 0) {
      sendMessage({
        threadId: thread._id,
        senderId: userId,
        text,
      }, token);
    }
    this.props.setMessageText('');
  }

  handleShowEmoji(e) {
    e.preventDefault();
    this.setState({
      showEmoji: !this.state.showEmoji,
    });
  }
  render() {
    const { userId, thread, hide } = this.props;
    return !hide ? (
      <div className="messageInputWrapper" style={styles.messageInputWrapper}>
        <EmojiPicker
          open={this.state.showEmoji}
          hide={() => this.setState({ showEmoji: false })}
          onClick={em => this.addEmoji(em)}
        />
        {thread.repIds.find(rep => rep === userId) ?
          <form className="messageInputForm" style={styles.messageInputForm}>
            <div className="newMessage" style={styles.newMessage}>
              <input
                type="text"
                className="newMessageInput"
                style={styles.newMessageInput}
                value={this.props.messageText}
                onKeyDown={this.sendMsgOnEnter}
                onChange={e => this.props.setMessageText(e.target.value)}
                placeholder="Type your message here..."
              />
              <div
                className="emojiBtn ignore-react-onclickoutside"
                style={styles.emojiBtn}
                key={2}
                onClick={this.handleShowEmoji}
              >
                <FaSmileO size={19} color="#7e7e7f" />
              </div>
            </div>
            <div
              style={styles.submitMessage}
              key={3}
              onClick={this.handleSendMessage}
            >
              <FaPaperPlane size={14} color="#fff" />
            </div>
          </form>
          : null
        }
      </div>
    ) : null;
  }
}

MessageInput.defaultProps = {
  thread: {},
  sendMessage: () => {},
  token: '',
  userId: '',
};

MessageInput.propTypes = {
  thread: PropTypes.shape({
    _id: PropTypes.string,
    live: PropTypes.boolean,
  }),
  userId: PropTypes.string,
  sendMessage: PropTypes.func,
  messageText: PropTypes.string.isRequired,
  setMessageText: PropTypes.func.isRequired,
  token: PropTypes.string,
  hide: PropTypes.bool.isRequired,
};

export default Radium(MessageInput);
