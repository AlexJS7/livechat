import React from 'react';
import { IndexRoute, Route } from 'react-router';
import protectAuth from '../utils/protectAuth';

import Chat from '../components/messenger-layout/Chat';
import Login from '../components/Login';
import Main from '../components/Main';
import Settings from '../components/settings-layout/Settings';

export default (
  <div>
    <Route path="/login" component={Login} />
    <Route onEnter={protectAuth} path="/main" component={Main}>
      <IndexRoute component={Chat} />
      <Route path="thread/:threadId" component={Chat} />
      <Route path="settings" component={Settings} />
    </Route>
    <Route path="/" component={Login} />
  </div>
);
