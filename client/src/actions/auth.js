import { browserHistory } from 'react-router';
import { toastr } from 'react-redux-toastr';
import api from '../lib/api';
import { auth as authTypes } from './types';

const updateUserInfoSuccess = user => ({ type: authTypes.updateUserInfo, user });

export function userLoginSuccess(payload) {
  localStorage.setItem('user_token', payload.token);
  localStorage.setItem('user_object', JSON.stringify(payload.user));
  return {
    type: authTypes.userLogin,
    payload,
  };
}

export const incrementLoginTries = () => ({ type: authTypes.incrementLoginTries });

export const userLogin = user => dispatch => api.login(user)
  .then(data => dispatch(userLoginSuccess(data)))
  .catch((err) => {
    toastr.error(`${err.response.data.message}`);
    dispatch(incrementLoginTries());
  });

export const updateUserInfo = (updateObj, token) => dispatch => api.updateUser(updateObj, token)
  .then(data => dispatch(updateUserInfoSuccess(data)))
  .catch(err => toastr.error(`${err.response.data.message}`));

export const updateUserPassword = (email, oldPassword, newPassword, token) => dispatch =>
  api.updatePassword(email, oldPassword, newPassword, token)
    .then(({ success, message }) => {
      if (success === true) {
        toastr.success('Password successfully updated');
      } else if (message === 'bad email') {
        toastr.error('Type correct email');
      } else {
        toastr.error('Type correct old password');
      }
    });

export const userLogout = () => {
  localStorage.clear();
  browserHistory.push('/login');
  return {
    type: authTypes.userLogout,
    payload: {
      user: {},
      token: '',
    },
  };
};
