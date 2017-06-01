import { auth as authTypes } from '../actions/types';

const initialState = {
  token: localStorage.getItem('user_token') || '',
  user: JSON.parse(localStorage.getItem('user_object')) || {},
  payload: {},
  loginTries: 0,
};

function auth(state = initialState, action) {
  switch (action.type) {
    case authTypes.userLogin:
      return { ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case authTypes.incrementLoginTries:
      return {
        ...state,
        loginTries: state.loginTries + 1,
      };
    case authTypes.updateUserInfo:
      return { ...state, user: action.user };
    case authTypes.userLogout:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loginTries: 0,
      };
    default:
      return state;
  }
}

export default auth;
