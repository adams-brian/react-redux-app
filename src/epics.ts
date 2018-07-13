import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { concat, from, of } from 'rxjs';
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

export type AppAction = LoadingAction | CountersAction | UsersAction | LocationChangeAction;

export type IState = IAppState | ICountersState | IUsersState;

export const loadCountersEpic: Epic<AppAction> = (action$) => action$.pipe(
  ofType(LOCATION_CHANGE),
  filter((action: LocationChangeAction) => action.payload.pathname.startsWith('/counters')),
  mergeMap(() =>
    concat(
      of(appActionCreators.startLoading()),
      from(loadCounters()).pipe(
        mergeMap(data =>
          concat(
            of(countersActionCreators.countersUpdated(data)),
            of(appActionCreators.doneLoading())
          )
        ),
        catchError(err => {
          console.log('request for counters failed: ' + err);
          return of(appActionCreators.doneLoading());
        })
      )
    )
  )
);

export const saveCountersEpic: Epic<AppAction> = (action$, state$) => action$.pipe(
  ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER),
  debounceTime(1000),
  tap(() => {
    const state = state$.value as ICountersState;
    saveCounters(state.counters)
    .catch(err => console.log('failed to save counters: ', err));
  }),
  ignoreElements()
);

export const loadUsersEpic: Epic<AppAction, AppAction, IState> = (action$, state$) => action$.pipe(
  ofType(LOCATION_CHANGE),
  filter((action: LocationChangeAction) =>
    action.payload.pathname.startsWith('/users') &&
    (state$.value as IUsersState).users.length === 0),
  mergeMap(() =>
    concat(
      of(appActionCreators.startLoading()),
      from(loadUsers()).pipe(
        mergeMap(data =>
          concat(
            of(usersActionCreators.usersUpdated(data)),
            of(appActionCreators.doneLoading())
          )
        ),
        catchError(err => {
          console.log('request for users failed: ' + err);
          return of(appActionCreators.doneLoading());
        })
      )
    )
  )
)

export const createUserEpic: Epic<AppAction> = (action$) => action$.pipe(
  ofType(CREATE_USER),
  tap((action: CreateUser) => {
    createUser(action.payload)
    .catch(err => console.log('failed to create user: ' + err));
  }),
  ignoreElements()
)

export const updateUserEpic: Epic<AppAction> = (action$) => action$.pipe(
  ofType(UPDATE_USER),
  tap((action: UpdateUser) => {
    updateUser(action.payload)
    .catch(err => console.log('failed to update user: ', err));
  }),
  ignoreElements()
)

export const deleteUserEpic: Epic<AppAction> = (action$) => action$.pipe(
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
