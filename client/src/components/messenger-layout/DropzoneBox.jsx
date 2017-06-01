import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

import MessageList from './MessageList';

const styles = {
  dropZone: {
    width: 'calc(100vw - 357px)',
    minWidth: '450px',
    height: '815px',
    border: 'none',
    position: 'relative',
    top: '0',
    zIndex: '10',
  },
  activeDropZone: {
    backgroundColor: 'rgba(191, 191, 191, 0.5)',
  },
};

export default class DropzoneBox extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    const { uploadFile, activeThread } = this.props;
    uploadFile(files[0], activeThread._id);
  }
  render() {
    const { messages, activeThread } = this.props;
    return (
      <Dropzone
        ref={(node) => { this.dropzone = node; }}
        onDrop={this.onDrop}
        disableClick
        style={styles.dropZone}
        activeStyle={{ ...styles.dropZone, ...styles.activeDropZone }}
      >
        {({ isDragActive }) => {
          if (!isDragActive) {
            return <MessageList activeThread={activeThread} messages={messages} />;
          }
          return null;
        }}
      </Dropzone>
    );
  }
}

DropzoneBox.defaultProps = {
  activeThread: {},
  messages: [],
  uploadFile: () => {},
};

DropzoneBox.propTypes = {
  activeThread: PropTypes.shape({
    id: PropTypes.string,
    live: PropTypes.boolean,
  }),
  messages: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    threadId: PropTypes.string,
    text: PropTypes.string,
  })),
  uploadFile: PropTypes.func,
};
