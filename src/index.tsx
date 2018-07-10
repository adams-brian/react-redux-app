import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import App from './App';
import { reducers as countersReducers } from './counters/store';
import epics from './epics';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { reducers as appReducers } from './store';
import { reducers as usersReducers } from './users/store';

// create a browser history
const history = createHistory();

export const store = createStore(
  combineReducers({
    ...appReducers,
    ...countersReducers,
    ...usersReducers,
    router: routerReducer
  }),
  composeWithDevTools(applyMiddleware(
    routerMiddleware(history),
    createEpicMiddleware(epics)
  ))
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
