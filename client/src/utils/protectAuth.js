import store from '../index';

const protectAuth = (nextState, replace) => {
  const { auth: { token } } = store.getState();
  if (!token) {
    replace({
      pathname: '/',
      state: {
        nextPathname: nextState.location.pathname,
      },
    });
  }
};

export default protectAuth;
