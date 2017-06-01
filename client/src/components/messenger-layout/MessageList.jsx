import React, { Component, PropTypes } from 'react';
import Message from './Message';

const styles = {
  wrapper: {
    height: 'calc(100% - 162px)',
    flexGrow: 1,
    width: '100%',
    overflowY: 'auto',
    padding: '8px 0px',
  },
};

class MessageList extends Component {
  // componentDidUpdate(prevProps) {
  //   const delta = this.chatBody.scrollHeight - this.chatBody.scrollTop;
  //   if (delta < 2000
  //     || !prevProps.messages.length
  //     || prevProps.messages[0].threadId !== this.props.messages[0].threadId) {
  //     this.chatBody.scrollTop = this.chatBody.scrollHeight;
  //   }
  // }

  render() {
    const { messages, userId } = this.props;
    return (
      <div style={styles.wrapper}>
        {messages.map(message => (
          <Message
            key={message._id}
            {...message}
            currentUser={message.senderId === userId}
          />
        ))}
      </div>
    );
  }
}

MessageList.defaultProps = {
  messages: [],
  userId: '',
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    threadId: PropTypes.string,
    text: PropTypes.string,
  })),
  userId: PropTypes.string,
};

export default MessageList;
