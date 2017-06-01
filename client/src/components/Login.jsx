import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import Recaptcha from 'react-recaptcha';

import actions from '../actions';

import bg from '../assets/img/bg.jpg';
import logo from '../assets/img/chat-logo.png';

const styles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${bg})`,
    backgroundSize: '0% 60% cover',
  },
  formParent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  formSignin: {
    width: 354,
    minWidth: 280,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    padding: '85px 0px 45px 0px',
    backgroundColor: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  logotype: {
    marginBottom: '8%',
    maxWidth: '200px',
    minWidth: '100px',
  },
  formSigninHeading: {
    fontFamily: 'opensans',
    fontSize: '16px',
    marginBottom: '30px',
  },
  formSigninCheckbox: {
    marginBottom: '20px',
    marginRight: '5px',
    fontWeight: 'normal',
  },
  formControl: {
    position: 'relative',
    fontSize: '14px',
    width: '70%',
    height: '40px',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#f2f2f2',
    color: '#949494',
    border: 'none',
    borderRadius: '21px',
  },
  passRecovery: {
    display: 'inline-block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#aaaaaa',
    cursor: 'pointer',
  },
  loginBtn: {
    width: '40%',
    margin: '0 auto 25px auto',
    backgroundColor: '#ff6711',
    fontSize: '16px',
    borderColor: '#ff6711',
    borderRadius: '25px',
    outline: 'none',
    ':hover': {
      opacity: '0.9',
    },
    ':active': {
      outline: 'none',
    },
  },
  inputEmail: {
    margin: '0 auto 20px auto',
  },
  inputPassword: {
    margin: '0 auto 20px auto',
  },
  captcha: {
    margin: '5px auto 15px auto',
    width: '304px',
  },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.verifyCaptcha = this.verifyCaptcha.bind(this);
    this.state = {
      captchaValidation: false,
    };
  }

  componentWillMount() {
    if (localStorage.getItem('user_token')) {
      browserHistory.push('/main');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { token } = nextProps;
    if (token) {
      browserHistory.push('/main');
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const { userLogin } = this.props.actions;
    userLogin({
      email: this.emailInput.value,
      password: this.passwordInput.value,
    });
  }

  verifyCaptcha() {
    this.setState({
      captchaValidation: true,
    });
  }

  render() {
    const { loginTries } = this.props;

    const captcha = process.env.REACT_APP_ENV === 'development' || loginTries < 2
      ? null
      : (<Recaptcha
        sitekey="6LcCvRgUAAAAAF3DD7jGfOaH0-DbvfJTrmEhi8dT"
        render="explicit"
        onloadCallback={() => {}}
        verifyCallback={this.verifyCaptcha}
      />);

    return (
      <div className="wrapper" style={styles.wrapper}>
        <div style={styles.formParent}>
          <form
            className="form-signin"
            style={styles.formSignin}
          >
            <img className="logotype" src={logo} alt="logo" style={styles.logotype} />
            <h2
              className="form-signin-heading"
              style={styles.formSigninHeading}
            >Welcome to Interactbot</h2>
            <input
              type="text"
              className="form-control"
              name="email"
              placeholder="Email"
              required=""
              autoFocus="true"
              ref={(input) => { this.emailInput = input; }}
              style={{ ...styles.inputEmail, ...styles.formControl }}
            />
            <input
              type="password"
              className="form-control pass-input"
              name="password"
              placeholder="Password"
              required=""
              ref={(input) => { this.passwordInput = input; }}
              style={{ ...styles.inputPassword, ...styles.formControl }}
            />
            <span className="passRecovery" style={styles.passRecovery}>Forgot password?</span>
            <div
              className="captcha"
              style={styles.captcha}
            >
              {captcha}
            </div>
            <button
              className="loginBtn btn btn-lg btn-primary btn-block"
              style={styles.loginBtn}
              onClick={this.handleLogin}
              disabled={process.env.REACT_APP_ENV === 'development' || loginTries < 2
                ? false
                : !this.state.captchaValidation}
            >Log in</button>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.auth.token,
    loginTries: state.auth.loginTries,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Radium(Login));

Login.defaultProps = {
  actions: {},
  token: '',
  loginTries: 0,
};

Login.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func),
  token: PropTypes.string,
  loginTries: PropTypes.number,
};
