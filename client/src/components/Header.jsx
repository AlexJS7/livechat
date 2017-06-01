import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import {
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import Radium from 'radium';
import * as actions from '../actions/auth';

const logo = 'https://s3-eu-west-1.amazonaws.com/interactbot/live-chat/interactbot/logo.png';

const styles = {
  mainHeaderWrapper: {
    height: 98,
    background: '#3598db',
    padding: '0 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: '2',
    position: 'fixed',
    top: '0',
    width: '100%',
    boxSizing: 'border-box',
    minWidth: '700px',
    userSelect: 'none',
  },
  mainHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    width: '65%',
    justifyContent: 'space-between',
  },
  logo: {
    paddingLeft: '10px',
    display: 'block',
  },
  userField: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  userFieldName: {
    fontFamily: 'opensansSemiBold',
    color: '#fff',
    marginLeft: '10px',
  },
  dropdownButton: {
    marginLeft: '5px',
  },
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.showSettings = this.showSettings.bind(this);
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.actions.userLogout();
  }

  showSettings(e) {
    e.preventDefault();
    browserHistory.push('/main/settings');
  }

  render() {
    const { user } = this.props;

    return (
      <div className="mainHeaderWrapper" style={styles.mainHeaderWrapper}>
        <div className="mainHeaderInfo" style={styles.mainHeaderInfo}>
          <div className="logo" style={styles.logo}>
            <Link to="/main"><img src={logo} alt="logo" /></Link>
          </div>
        </div>
        <div className="userField" style={styles.userField}>
          <strong
            className="userFieldName"
            style={styles.userFieldName}
          >{`${user.firstName} ${user.lastName}`}</strong>
          <NavDropdown title="" id="options-dropdown" pullRight style={styles.dropdownButton}>
            <MenuItem
              eventKey={1}
              bsStyle="primary" onClick={this.showSettings}
            >Settings</MenuItem>
            <MenuItem divider />
            <MenuItem
              eventKey={2}
              bsStyle="primary" onClick={this.handleLogout}
            >Log out</MenuItem>
          </NavDropdown>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.auth.user,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Radium(Header));

Header.defaultProps = {
  user: {},
  actions: {},
};

Header.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  actions: PropTypes.objectOf(PropTypes.func),
};
