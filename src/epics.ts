import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';
import { combineEpics, Epic } from 'redux-observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/ignoreElements';

import { actionCreators, ADD_COUNTER, AppAction,
  CREATE_USER, CreateUser, DECREMENT, DELETE_USER, DeleteUser,
  IAppState, INCREMENT, REMOVE_COUNTER, RESET } from './store';

const loadCounters: Epic<AppAction, IAppState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    if (action.payload.pathname.startsWith('/counters')) {
      store.dispatch(actionCreators.startLoading());
      fetch('http://localhost:4000/counters')
      .then((response) => response.json())
      .then((json) => {
        store.dispatch(actionCreators.countersUpdated(json.data));
        store.dispatch(actionCreators.doneLoading());
      })
      .catch((err) => {
        console.log('request for counters failed: ', err);
        store.dispatch(actionCreators.doneLoading());
      });
    }
  })
  .ignoreElements();

const saveCounters: Epic<AppAction, IAppState> = (action$, store) => action$
  .ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER)
  .debounceTime(1000)
  .do((action: AppAction) => {
    fetch('http://localhost:4000/counters', {
      body: JSON.stringify({counters: store.getState().counters}),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'post'
    })
    .catch((err) => console.log('failed to save counters: ', err));
  })
  .ignoreElements();

const loadUsers: Epic<AppAction, IAppState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    const s = store.getState();
    if (action.payload.pathname.startsWith('/users') && s.users.length === 0) {
      store.dispatch(actionCreators.startLoading());
      fetch('http://localhost:4000/users')
      .then((response) => response.json())
      .then((json) => {
        store.dispatch(actionCreators.usersUpdated(json.data));
        store.dispatch(actionCreators.doneLoading());
      })
      .catch((err) => {
        console.log('request for users failed: ', err);
        store.dispatch(actionCreators.doneLoading());
      });
    }
  })
  .ignoreElements();

const createUser: Epic<AppAction, IAppState> = (action$, store) => action$
  .ofType(CREATE_USER)
  .do((action: CreateUser) => {
    fetch('http://localhost:4000/users', {
      body: JSON.stringify(action.payload),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'put'
    })
    .catch((err) => console.log('failed to create user: ', err));
  })
  .ignoreElements();

const deleteUser: Epic<AppAction, IAppState> = (action$, store) => action$
  .ofType(DELETE_USER)
  .do((action: DeleteUser) => {
    fetch('http://localhost:4000/users/' + action.payload, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'delete'
    })
    .catch((err) => console.log('failed to delete user: ', err));
  })
  .ignoreElements();

export const epics = combineEpics(
  loadCounters,
  saveCounters,
  loadUsers,
  createUser,
  deleteUser
);
