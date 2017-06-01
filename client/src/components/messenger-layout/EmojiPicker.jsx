import React, { Component, PropTypes } from 'react';
import { Picker } from 'emoji-mart';
import onClickOutside from 'react-onclickoutside';

const styles = {
  emojiContainerParent: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    pointerEvents: 'none',
  },
  emojiContainer: {
    position: 'relative',
    bottom: '230px',
    zIndex: '12',
    fontSize: '16px',
    fontFamily: 'Helvetica Neue',
    color: '#222427',
    background: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '5px',
    marginLeft: 40,
  },
};

class EmojiPicker extends Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside() {
    this.props.hide();
  }

  render() {
    return this.props.open ? (
      <div className="ignore-react-onclickoutside" style={styles.emojiContainerParent}>
        <Picker
          set="apple"
          style={styles.emojiContainer}
          emojiSize={24}
          perLine={9}
          native={false}
          skin={1}
          onClick={this.props.onClick}
        />
      </div>
    ) : null;
  }
}

EmojiPicker.propTypes = {
  open: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default onClickOutside(EmojiPicker);
