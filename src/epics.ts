import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { catchError, debounceTime, filter,
  ignoreElements, mergeMap, tap } from 'rxjs/operators';

import { loadCounters, saveCounters } from './counters/api';
import { actionCreators as countersActionCreators, ADD_COUNTER, 
  CountersAction, DECREMENT, INCREMENT, 
  IState as ICountersState, REMOVE_COUNTER, RESET } from './counters/store';

import { actionCreators as appActionCreators, 
  IState as IAppState, LoadingAction } from './store';

import { createUser, deleteUser, loadUsers, updateUser } from './users/api';
import { actionCreators as usersActionCreators, 
  CREATE_USER, CreateUser, DELETE_USER, DeleteUser,
  IState as IUsersState, UPDATE_USER, UpdateUser, UsersAction } from './users/store';

type AppAction = LoadingAction | CountersAction | UsersAction | LocationChangeAction;

type IState = IAppState | ICountersState | IUsersState;

export const loadCountersEpic: Epic<AppAction, IState> = (action$) => action$.pipe(
  ofType(LOCATION_CHANGE),
  filter((action: LocationChangeAction) => action.payload.pathname.startsWith('/counters')),
  mergeMap(() =>
    Observable.concat(
      Observable.of(appActionCreators.startLoading()),
      Observable.fromPromise(loadCounters()).pipe(
        mergeMap(data =>
          Observable.concat(
            Observable.of(countersActionCreators.countersUpdated(data)),
            Observable.of(appActionCreators.doneLoading())
          )
        ),
        catchError(err => {
          console.log('request for counters failed: ' + err);
          return Observable.of(appActionCreators.doneLoading());
        })
      )
    )
  )
);

export const saveCountersEpic: Epic<AppAction, IState> = (action$, store) => action$.pipe(
  ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER),
  debounceTime(1000),
  tap(() => {
    const state = store.getState() as ICountersState;
    saveCounters(state.counters)
    .catch(err => console.log('failed to save counters: ', err));
  }),
  ignoreElements()
);

export const loadUsersEpic: Epic<AppAction, IState> = (action$, store) => action$.pipe(
  ofType(LOCATION_CHANGE),
  filter((action: LocationChangeAction) =>
    action.payload.pathname.startsWith('/users') &&
    (store.getState() as IUsersState).users.length === 0),
  mergeMap(() =>
    Observable.concat(
      Observable.of(appActionCreators.startLoading()),
      Observable.fromPromise(loadUsers()).pipe(
        mergeMap(data =>
          Observable.concat(
            Observable.of(usersActionCreators.usersUpdated(data)),
            Observable.of(appActionCreators.doneLoading())
          )
        ),
        catchError(err => {
          console.log('request for users failed: ' + err);
          return Observable.of(appActionCreators.doneLoading());
        })
      )
    )
  )
)

export const createUserEpic: Epic<AppAction, IState> = (action$) => action$.pipe(
  ofType(CREATE_USER),
  tap((action: CreateUser) => {
    createUser(action.payload)
    .catch(err => console.log('failed to create user: ' + err));
  }),
  ignoreElements()
)

export const updateUserEpic: Epic<AppAction, IState> = (action$) => action$.pipe(
  ofType(UPDATE_USER),
  tap((action: UpdateUser) => {
    updateUser(action.payload)
    .catch(err => console.log('failed to update user: ', err));
  }),
  ignoreElements()
)

export const deleteUserEpic: Epic<AppAction, IState> = (action$, store) => action$.pipe(
  ofType(DELETE_USER),
  tap((action: DeleteUser) => {
    deleteUser(action.payload)
    .catch(err => console.log('failed to delete user: ', err));
  }),
  ignoreElements()
)

export default combineEpics(
  loadCountersEpic,
  saveCountersEpic,
  loadUsersEpic,
  createUserEpic,
  updateUserEpic,
  deleteUserEpic
);
