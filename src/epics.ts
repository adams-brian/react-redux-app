import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/ignoreElements';
import { combineEpics, Epic } from 'redux-observable';
import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';

import { AppAction, AppState, actionCreators, 
  INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER,
  CREATE_USER, CreateUser, DELETE_USER, DeleteUser } from './store';

const loadCounters: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    if (action.payload.pathname.startsWith('/counters')) {
      store.dispatch(actionCreators.startLoading());
      fetch('http://localhost:3000/counters')
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

const saveCounters: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER)
  .debounceTime(1000)
  .do((action: AppAction) => {
    fetch('http://localhost:3000/counters', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({counters: store.getState().counters})
    })
    .catch((err) => console.log('failed to save counters: ', err));
  })
  .ignoreElements();

const loadUsers: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    const s = store.getState();
    if (action.payload.pathname.startsWith('/users') && s.users.length === 0) {
      store.dispatch(actionCreators.startLoading());
      fetch('http://localhost:3000/users')
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

const createUser: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(CREATE_USER)
  .do((action: CreateUser) => {
    fetch('http://localhost:3000/users', {
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    })
    .catch((err) => console.log('failed to create user: ', err));
  })
  .ignoreElements();

const deleteUser: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(DELETE_USER)
  .do((action: DeleteUser) => {
    fetch('http://localhost:3000/users/' + action.payload, {
      method: 'delete',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
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
