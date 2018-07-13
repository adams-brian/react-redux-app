import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import App from './App';
import { reducers as countersReducers } from './counters/store';
import rootEpic from './epics';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { reducers as appReducers } from './store';
import { reducers as usersReducers } from './users/store';

// create a browser history
const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware();

export const store = createStore(
  connectRouter(history)(
    combineReducers({
      ...appReducers,
      ...countersReducers,
      ...usersReducers
    })
  ),
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history),
      epicMiddleware
    )
  )
);

epicMiddleware.run(rootEpic);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
