import React, { PropTypes } from 'react';
import Linkify from 'react-linkify';

const styles = {
  root: {
    fontFamily: 'sans-serif',
  },
  parent: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    borderRadius: 20,
    padding: 13,
    marginTop: 5,
    marginBottom: 5,
    display: 'inline-block',
    maxWidth: 280,
    fontSize: 15,
    lineHeight: '140%',
    wordWrap: 'break-word',
    color: '#fff',
    zIndex: 2,
  },
  currentUser: {
    parent: {
      justifyContent: 'flex-end',
    },
    child: {
      backgroundColor: '#3598db',
      marginRight: 10,
      marginLeft: 30,
    },
    text: {
      color: '#fff',
    },
  },
  otherUser: {
    parent: {
      justifyContent: 'flex-start',
    },
    child: {
      backgroundColor: '#fff',
      marginRight: 30,
      marginLeft: 10,
    },
    text: {
      color: '#000',
    },
  },
};

const Message = ({ _id, text, currentUser }) => (
  <div style={styles.root} id={`message${_id}`}>
    <div style={{ ...styles.parent, ...styles[currentUser ? 'currentUser' : 'otherUser'].parent }}>
      <div style={{ ...styles.child, ...styles[currentUser ? 'currentUser' : 'otherUser'].child }}>
        <Linkify properties={{ target: '_blank', style: styles[currentUser ? 'currentUser' : 'otherUser'].text }}>
          <span style={styles[currentUser ? 'currentUser' : 'otherUser'].text}>{text}</span>
        </Linkify>
      </div>
    </div>
  </div>
);

Message.propTypes = {
  _id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  currentUser: PropTypes.bool.isRequired,
};

export default Message;
