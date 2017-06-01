import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

import auth from './auth';
import chat from './chat';
import messages from './messages';
import threads from './threads';
import users from './users';

const reducer = combineReducers({
  auth,
  chat,
  messages,
  threads,
  users,
  routing,
  toastr: toastrReducer,
});

export default reducer;
