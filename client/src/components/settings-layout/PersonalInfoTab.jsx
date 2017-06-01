import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import _ from 'lodash';
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
    width: '40%',
    margin: '40px auto 0 auto',
    backgroundColor: '#ff6711',
    fontSize: '16px',
    borderColor: '#ff6711',
    borderRadius: '25px',
    marginBottom: '25px',
    ':hover': {
      opacity: '0.9',
    },
  },
};

class PersonalInfoTab extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateUserInfo = this.handleUpdateUserInfo.bind(this);
  }

  handleUpdateUserInfo(e) {
    e.preventDefault();
    const { token, updateUserInfo } = this.props;
    const newUserInfo = _.pickBy({
      firstName: this.firstNameValue.value,
      lastName: this.lastNameValue.value,
      email: this.emailValue.value,
    }, _.identity);
    updateUserInfo(newUserInfo, token);
    this.firstNameValue.value = '';
    this.lastNameValue.value = '';
    this.emailValue.value = '';
  }
  render() {
    const { user } = this.props;
    return (
      <div>
        <Form horizontal>
          <FormGroup controlId="changeFirstName" style={styles.formGroup}>
            <Col
              className="inputLabel"
              style={styles.inputLabel}
              componentClass={ControlLabel}
            >First Name:</Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder={user.firstName}
                style={styles.formControl}
                ref={(input) => { this.firstNameValue = input; }}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="changeLastName" style={styles.formGroup}>
            <Col
              className="inputLabel"
              style={styles.inputLabel}
              componentClass={ControlLabel}
            >Last Name:</Col>
            <Col >
              <input
                type="text"
                className="form-control"
                placeholder={user.lastName}
                style={styles.formControl}
                ref={(input) => { this.lastNameValue = input; }}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="changeEmail" style={styles.formGroup}>
            <Col
              className="inputLabel"
              style={styles.inputLabel}
              componentClass={ControlLabel}
            >Email:</Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder={user.email}
                style={styles.formControl}
                ref={(input) => { this.emailValue = input; }}
              />
            </Col>
          </FormGroup>
        </Form>
        <Button
          bsStyle="primary"
          style={styles.button}
          onClick={this.handleUpdateUserInfo}
        >Change info</Button>
      </div>
    );
  }
}

export default Radium(PersonalInfoTab);

PersonalInfoTab.defaultProps = {
  token: '',
  user: {},
  updateUserInfo: () => {},
};

PersonalInfoTab.propTypes = {
  token: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.string,
  }),
  updateUserInfo: PropTypes.func,
};
