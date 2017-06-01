import React, { Component, PropTypes } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/lib/fa';
import onClickOutside from 'react-onclickoutside';

const styles = {
  list: {
    left: -140,
  },
  item: {
    userSelect: 'none',
  },
};

class ChatBodyHeaderMenu extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.showThreadModal = this.showThreadModal.bind(this);
  }

  handleClickOutside() {
    this.setState({ open: false });
  }

  toggleDropdown() {
    this.setState({ open: !this.state.open });
  }

  showThreadModal(mode) {
    const { openModal } = this.props;
    openModal(mode);
  }
  render() {
    return (
      <Dropdown pullRight open={this.state.open}>
        <div
          className="ignore-react-onclickoutside"
          onClick={this.toggleDropdown}
          bsRole="toggle"
        >
          <FaEllipsisV size={18} color="#7e7e7f" />
        </div>
        <ul
          className="dropdown-menu"
          style={styles.list}
          bsRole="menu"
        >
          <MenuItem
            eventKey={1}
            bsStyle="primary"
            style={styles.item}
            onClick={() => this.showThreadModal('addRep')}
          >Add rep to thread</MenuItem>
          <MenuItem divider />
          <MenuItem
            eventKey={2}
            bsStyle="primary"
            style={{ userSelect: 'none' }}
            onClick={() => this.showThreadModal('changeRep')}
          >Reassign thread</MenuItem>
        </ul>
      </Dropdown>
    );
  }
}

export default onClickOutside(ChatBodyHeaderMenu);

ChatBodyHeaderMenu.defaultProps = {
  openModal: () => {},
};

ChatBodyHeaderMenu.propTypes = {
  openModal: PropTypes.func,
};
