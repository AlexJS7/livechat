import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  Button,
} from 'react-bootstrap';

const styles = {
  formGroup: {
    margin: '0 auto 20px auto',
    width: '70%',
  },
  inputLabel: {
    color: '#555555',
    paddingLeft: '15px',
    paddingBottom: '8px',
  },
  formControl: {
    position: 'relative',
    fontSize: '14px',
    width: '100%',
    height: '40px',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#f2f2f2',
    color: 'black',
    borderRadius: '21px',
  },
  button: {
    display: 'block',
    width: '50%',
    margin: '40px auto 0 auto',
    backgroundColor: '#ff6711',
    fontSize: '16px',
    borderColor: '#ff6711',
    borderRadius: '25px',
    marginBottom: '25px',
    outline: 'none',
    ':hover': {
      opacity: '0.9',
    },
    ':active': {
      outline: 'none',
    },
  },
  badMatch: {
    border: '1px solid red',
  },
  badMatchSpan: {
    color: 'red',
    textAlign: 'center',
  },
}

class ChangePasswordTab extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateUserPass = this.handleUpdateUserPass.bind(this);
    this.state = {
      badMatch: false,
    };
  }

  handleUpdateUserPass(e) {
    e.preventDefault();
    if (this.confirmNewPassValue.value !== this.newPassValue.value
      || !this.oldPassValue.value || !this.newPassValue.value) {
      this.setState({
        badMatch: true,
      });
    } else {
      this.setState({
        badMatch: false,
      });
      const { token, user, updateUserPassword } = this.props;
      updateUserPassword(
        user.email,
        this.oldPassValue.value,
        this.confirmNewPassValue.value, token,
      );
      this.oldPassValue.value = '';
      this.newPassValue.value = '';
      this.confirmNewPassValue.value = '';
    }
  }
  render() {
    return (
      <div>
        <Form horizontal>
          <FormGroup controlId="oldPassword" style={styles.formGroup}>
            <Col componentClass={ControlLabel} style={styles.inputLabel}>
              Old password:
            </Col>
            <Col>
              <input
                type="password"
                className="form-control"
                placeholder="Type old password"
                style={styles.formControl}
                ref={(input) => { this.oldPassValue = input; }}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="newPassword" style={styles.formGroup}>
            <Col componentClass={ControlLabel} style={styles.inputLabel}>
              New password:
            </Col>
            <Col>
              <input
                type="password"
                className="form-control"
                placeholder="Type new password"
                ref={(input) => { this.newPassValue = input; }}
                style={this.state.badMatch
                  ? { ...styles.badMatch, ...styles.formControl }
                  : styles.formControl}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="confirmNewPassword" style={styles.formGroup}>
            <Col componentClass={ControlLabel} style={styles.inputLabel}>
              Confirm new password:
            </Col>
            <Col>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                ref={(input) => { this.confirmNewPassValue = input; }}
                style={this.state.badMatch
                  ? { ...styles.badMatch, ...styles.formControl }
                  : styles.formControl}
              />
              {this.state.badMatch
                ? <div style={styles.badMatchSpan}>Passwords do not match</div>
                : ''}
            </Col>
          </FormGroup>
        </Form>
        <Button
          bsStyle="primary"
          style={styles.button}
          onClick={this.handleUpdateUserPass}
        >Change password</Button>
      </div>
    );
  }
}

export default Radium(ChangePasswordTab);

ChangePasswordTab.defaultProps = {
  token: '',
  user: {},
  updateUserPassword: () => {},
};

ChangePasswordTab.propTypes = {
  token: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
  updateUserPassword: PropTypes.func,
};
