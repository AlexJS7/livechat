import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const styles = {
  dropZone: {
    width: '100%',
    border: 'none',
    position: 'absolute',
    top: 72,
    zIndex: 1,
    height: 'calc(100% - 162px)',
  },
  activeDropZone: {
    backgroundColor: 'rgba(191, 191, 191, 0.5)',
  },
};

export default class DropzoneOverlay extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    const { uploadFile, activeThreadId } = this.props;
    uploadFile(files[0], activeThreadId);
  }

  render() {
    return (
      <Dropzone
        id="dropzone"
        ref={(node) => { this.dropzone = node; }}
        onDrop={this.onDrop}
        disableClick
        style={styles.dropZone}
        activeStyle={{ ...styles.dropZone, ...styles.activeDropZone }}
      />
    );
  }
}

DropzoneOverlay.defaultProps = {
  uploadFile: () => {},
};

DropzoneOverlay.propTypes = {
  activeThreadId: PropTypes.string.isRequired,
  uploadFile: PropTypes.func,
};
