import React, { PropTypes, Component } from 'react';
import Radium from 'radium';
import { FaUserPlus } from 'react-icons/lib/fa';
import ChatBodyHeaderMenu from './ChatBodyHeaderMenu';
import ThreadModal from './ThreadModal';

const styles = {
  chatBodyHeader: {
    height: '72px',
    background: '#fff',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 60px',
    boxSizing: 'border-box',
    top: '98px',
    zIndex: '11',
    minWidth: '450px',
  },
  chatBodyUserInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  chatBodyUserInfoName: {
    fontSize: '18px',
  },
};

class ChatBodyHeader extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.state = {
      modalOpened: false,
      mode: '',
    };
  }

  openModal(mode) {
    this.setState({
      modalOpened: true,
      mode,
    });
  }

  closeModal() {
    this.setState({
      modalOpened: false,
      mode: '',
    });
  }

  modalTitle() {
    switch (this.state.mode) {
      case 'addRep':
        return 'Add representative to the thread';
      case 'changeRep':
        return 'Reassign representative of the thread';
      default:
        return '';
    }
  }

  chatBodyTitle() {
    const { threadName, repIds, users } = this.props;
    let title = threadName;
    if (threadName && repIds) {
      if (repIds) {
        repIds.forEach((rep) => {
          if (users[rep] && users[rep].name) {
            title += `, ${users[rep].name.first} ${users[rep].name.last.substring(0, 1)}.`;
          }
        });
      }
      return title;
    }
    return '';
  }

  render() {
    return (
      <div className="chatBodyHeader" style={styles.chatBodyHeader}>
        <div className="chatBodyUserInfo" style={styles.chatBodyUserInfo}>
          <strong style={styles.chatBodyUserInfoName}>{this.chatBodyTitle()}</strong>
        </div>
        {!this.props.undreadThread ? (
          <ChatBodyHeaderMenu openModal={this.openModal} />
        ) : (
          <FaUserPlus
            style={{ cursor: 'pointer' }}
            size={18}
            color="#7e7e7f"
            onClick={() => this.props.assignToSelf(this.props.threadId)}
          />
        )}
        <ThreadModal
          show={this.state.modalOpened}
          mode={this.state.mode}
          onClose={this.closeModal}
          title={this.modalTitle()}
          userId={this.props.userId}
          users={this.props.users}
          addRepToThread={this.props.addRepToThread}
          assignThread={this.props.assignThread}
          threadId={this.props.threadId}
          token={this.props.token}
        />
      </div>
    );
  }
}

ChatBodyHeader.defaultProps = {
  addRepToThread: () => {},
  token: '',
};

ChatBodyHeader.propTypes = {
  threadId: PropTypes.string.isRequired,
  threadName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  repIds: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  addRepToThread: PropTypes.func,
  assignThread: PropTypes.func.isRequired,
  assignToSelf: PropTypes.func.isRequired,
  token: PropTypes.string,
  undreadThread: PropTypes.bool.isRequired,
};

export default Radium(ChatBodyHeader);
