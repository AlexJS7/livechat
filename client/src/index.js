/* eslint react/jsx-filename-extension: 0 */
import 'bootstrap/dist/css/bootstrap.css';
import 'react-select/dist/react-select.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ReduxToastr from 'react-redux-toastr';
import dotenv from 'dotenv';
import routes from './routes';
import reducer from './reducer';
import './assets/style/index.css';
import './assets/style/emoji-mart.css';

dotenv.config();

const logger = createLogger({
  collapsed: true,
});

const store = createStore(
  reducer,
  compose(
    applyMiddleware(logger, thunk),
    // DevTools.instrument()
  ),
);

export default store;

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history} routes={routes} />
      {/* <DevTools /> */}
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="bottom-right"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
      />
    </div>
  </Provider>,
  document.getElementById('root'),
);
