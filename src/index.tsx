
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import { App } from './App';
import { reducers } from './store';
import { epics } from './epics';

// create a browser history
const history = createHistory();

export const store = createStore(
  combineReducers({
    ...reducers,
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
