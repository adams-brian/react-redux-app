import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';
import { combineEpics, Epic } from 'redux-observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/ignoreElements';

import { actionCreators as countersActionCreators, ADD_COUNTER, 
  CountersAction, DECREMENT, INCREMENT, 
  IState as ICountersState, REMOVE_COUNTER, RESET } from './counters/store';
import { actionCreators as appActionCreators, 
  IState as IAppState, LoadingAction } from './store';
import { actionCreators as usersActionCreators, 
  CREATE_USER, CreateUser, DELETE_USER, DeleteUser,
  IState as IUsersState, UPDATE_USER, UpdateUser, UsersAction } from './users/store';

export type AppAction = LoadingAction | CountersAction | UsersAction | LocationChangeAction;

type IState = IAppState | ICountersState | IUsersState;

const loadCounters: Epic<AppAction, IState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    if (action.payload.pathname.startsWith('/counters')) {
      store.dispatch(appActionCreators.startLoading());
      fetch('http://localhost:4000/counters')
      .then((response) => response.json())
      .then((json) => {
        store.dispatch(countersActionCreators.countersUpdated(json.data));
        store.dispatch(appActionCreators.doneLoading());
      })
      .catch((err) => {
        console.log('request for counters failed: ', err);
        store.dispatch(appActionCreators.doneLoading());
      });
    }
  })
  .ignoreElements();

const saveCounters: Epic<AppAction, IState> = (action$, store) => action$
  .ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER)
  .debounceTime(1000)
  .do((action: AppAction) => {
    const state = store.getState() as ICountersState;
    fetch('http://localhost:4000/counters', {
      body: JSON.stringify({counters: state.counters}),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'post'
    })
    .catch((err) => console.log('failed to save counters: ', err));
  })
  .ignoreElements();

const loadUsers: Epic<AppAction, IState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    const state = store.getState() as IUsersState;
    if (action.payload.pathname.startsWith('/users') && state.users.length === 0) {
      store.dispatch(appActionCreators.startLoading());
      fetch('http://localhost:4000/users')
      .then((response) => response.json())
      .then((json) => {
        store.dispatch(usersActionCreators.usersUpdated(json.data));
        store.dispatch(appActionCreators.doneLoading());
      })
      .catch((err) => {
        console.log('request for users failed: ', err);
        store.dispatch(appActionCreators.doneLoading());
      });
    }
  })
  .ignoreElements();

const createUser: Epic<AppAction, IState> = (action$, store) => action$
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

const updateUser: Epic<AppAction, IState> = (action$, store) => action$
  .ofType(UPDATE_USER)
  .do((action: UpdateUser) => {
    fetch('http://localhost:4000/users/' + action.payload._id, {
      body: JSON.stringify(action.payload),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'post'
    })
    .catch((err) => console.log('failed to update user: ', err));
  })
  .ignoreElements();

const deleteUser: Epic<AppAction, IState> = (action$, store) => action$
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

export default combineEpics(
  loadCounters,
  saveCounters,
  loadUsers,
  createUser,
  updateUser,
  deleteUser
);
