import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import {
  Button,
  Modal,
} from 'react-bootstrap';

const styles = {
  modalWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 150,
  },
};

export default class ThreadModal extends Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.fireAction = this.fireAction.bind(this);
    this.state = {
      selectValue: null,
    };
  }

  fireAction() {
    const { mode, addRepToThread, assignThread, threadId, token } = this.props;
    switch (mode) {
      case 'addRep':
        addRepToThread(this.state.selectValue.split(','), threadId, token);
        this.close();
        this.setState({
          selectValue: null,
        });
        break;
      case 'changeRep':
        assignThread(this.state.selectValue, threadId, token);
        this.close();
        this.setState({
          selectValue: null,
        });
        break;
      default:
    }
  }

  close() {
    this.setState({
      selectValue: null,
    });
    this.props.onClose();
  }

  selectChange(val) {
    this.setState({
      selectValue: val,
    });
  }

  render() {
    const { show, title, users, userId, mode } = this.props;
    const userOptions = Object.keys(users)
      .map(id => ({
        value: id,
        label: users[id].email,
      }))
      .filter(user => user.id !== userId);
    return (
      <Modal show={show} onHide={this.close} style={styles.modalWrapper}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(users).length ? (
            <Select
              autofocus
              multi={mode === 'addRep'}
              value={this.state.selectValue}
              simpleValue
              name="users-select"
              options={userOptions}
              onChange={this.selectChange}
            />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.fireAction}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ThreadModal.defaultProps = {
  show: false,
  mode: '',
  onClose: () => {},
  userId: '',
  title: '',
  addRepToThread: () => {},
  token: '',
  threadId: '',
};

ThreadModal.propTypes = {
  show: PropTypes.bool,
  mode: PropTypes.string,
  onClose: PropTypes.func,
  threadId: PropTypes.string,
  userId: PropTypes.string,
  users: PropTypes.object.isRequired,
  title: PropTypes.string,
  addRepToThread: PropTypes.func,
  assignThread: PropTypes.func.isRequired,
  token: PropTypes.string,
};
