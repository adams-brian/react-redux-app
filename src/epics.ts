import { LOCATION_CHANGE, RouterState } from 'connected-react-router';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { concat, from, of } from 'rxjs';
import { catchError, debounceTime, filter,
  ignoreElements, mergeMap, tap } from 'rxjs/operators';

import { loadCounters, saveCounters } from './counters/api';
import { actionCreators as countersActionCreators,
  ADD_COUNTER, DECREMENT, INCREMENT,
  IState as ICountersState, REMOVE_COUNTER, RESET } from './counters/store';

import { actionCreators as appActionCreators } from './store';

import { createUser, deleteUser, loadUsers, updateUser } from './users/api';
import { actionCreators as usersActionCreators, 
  CREATE_USER, CreateUser, DELETE_USER, DeleteUser,
  LOAD_USERS, UPDATE_USER, UpdateUser } from './users/store';

export const loadCountersEpic: Epic = (action$, state$) => action$.pipe(
  ofType(LOCATION_CHANGE),
  filter(() => (state$.value.router as RouterState).location.pathname.startsWith('/counters')),
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

export const saveCountersEpic: Epic = (action$, state$) => action$.pipe(
  ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER),
  debounceTime(1000),
  tap(() => {
    const state = state$.value as ICountersState;
    saveCounters(state.counters.list)
    .catch(err => console.log('failed to save counters: ', err));
  }),
  ignoreElements()
);

export const loadUsersEpic: Epic = (action$, state$) => action$.pipe(
  ofType(LOAD_USERS),
  mergeMap(() =>
    from(loadUsers()).pipe(
      mergeMap(data =>
        concat(
          of(usersActionCreators.usersUpdated(data)),
          of(usersActionCreators.usersLoaded())
        )
      ),
      catchError(err => {
        return of(usersActionCreators.usersError(err));
      })
    )
  )
)

export const createUserEpic: Epic = (action$) => action$.pipe(
  ofType(CREATE_USER),
  tap((action: CreateUser) => {
    createUser(action.payload)
    .catch(err => console.log('failed to create user: ' + err));
  }),
  ignoreElements()
)

export const updateUserEpic: Epic = (action$) => action$.pipe(
  ofType(UPDATE_USER),
  tap((action: UpdateUser) => {
    updateUser(action.payload)
    .catch(err => console.log('failed to update user: ', err));
  }),
  ignoreElements()
)

export const deleteUserEpic: Epic = (action$) => action$.pipe(
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
