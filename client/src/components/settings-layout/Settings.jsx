import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Radium from 'radium';

import PersonalInfoTab from './PersonalInfoTab';
import ChangePasswordTab from './ChangePasswordTab';
import actions from '../../actions';

const styles = {
  settingsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  settingsContainer: {
    height: '66%',
    minWidth: '360px',
    minHeight: '540px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  settingsHeading: {
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '24px',
    color: '#363636',
    marginBottom: '25px',
  },
  tabSection: {
    width: '100%',
    marginBottom: '20px',
  },
  tabList: {
    display: 'flex',
  },
  tabCell: {
    flexBasis: '50%',
    borderBottom: '1px solid #edf0f2',
    display: 'block',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    padding: '18px 0',
    fontSize: '16px',
    color: '#adadad',
    fontFamily: 'opensansSemiBold',
    ':hover': {
      color: '#8cc4ea',
      cursor: 'pointer',
    },
  },
  tabCellLeftActive: {
    borderRight: '1px solid #edf0f2',
    borderTop: '1px solid #3598db',
  },
  tabCellRightActive: {
    borderLeft: '1px solid #edf0f2',
    borderTop: '1px solid #3598db',
  },
  tabCellActive: {
    borderBottom: 'none',
    color: '#3598db',
  },
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.showUserInfo = this.showUserInfo.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.state = {
      showPasswordTab: false,
    };
  }

  showUserInfo(e) {
    e.preventDefault();
    this.setState({
      showPasswordTab: false,
    });
  }

  showPassword(e) {
    e.preventDefault();
    this.setState({
      showPasswordTab: true,
    });
  }
  render() {
    const { user, token } = this.props;
    const { updateUserInfo, updateUserPassword } = this.props.actions;
    const { showPasswordTab } = this.state;
    const body = showPasswordTab
      ? <ChangePasswordTab user={user} token={token} updateUserPassword={updateUserPassword} />
      : <PersonalInfoTab user={user} token={token} updateUserInfo={updateUserInfo} />;
    return (
      <div className="settingsWrapper" style={styles.settingsWrapper}>
        <div className="settingsContainer" style={styles.settingsContainer}>
          <h2 className="settingsHeading" style={styles.settingsHeading}>Settings</h2>
          <div className="tabSection" style={styles.tabSection}>
            <ul className="tabList" style={styles.tabList}>
              <li
                style={this.state.showPasswordTab
                  ? { ...styles.tabCell }
                  : { ...styles.tabCell, ...styles.tabCellActive, ...styles.tabCellLeftActive }}
                key={1}
                onClick={this.showUserInfo}
              >Personal info</li>
              <li
                className="activeTab"
                style={this.state.showPasswordTab
                  ? { ...styles.tabCell, ...styles.tabCellActive, ...styles.tabCellRightActive }
                  : { ...styles.tabCell }}
                key={2}
                onClick={this.showPassword}
              >Change password</li>
            </ul>
          </div>
          {body}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.auth.token,
    user: state.auth.user,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Radium(Settings));

Settings.defaultProps = {
  token: '',
  user: {},
  actions: {},
};

Settings.propTypes = {
  token: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
  actions: PropTypes.objectOf(PropTypes.func),
};
