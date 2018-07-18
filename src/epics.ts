import { combineEpics, Epic, ofType } from 'redux-observable';
import { concat, from, of } from 'rxjs';
import { catchError, debounceTime, mergeMap } from 'rxjs/operators';

import { loadCounters, saveCounters } from './counters/api';
import { actionCreators as countersActionCreators,
  ADD_COUNTER, DECREMENT, INCREMENT, IState as ICountersState,
  LOAD_COUNTERS, REMOVE_COUNTER, RESET } from './counters/store';

import { createUser, deleteUser, loadUsers, updateUser } from './users/api';
import { actionCreators as usersActionCreators, 
  CREATE_USER, CreateUser, DELETE_USER, DeleteUser,
  LOAD_USERS, UPDATE_USER, UpdateUser } from './users/store';

export const loadCountersEpic: Epic = (action$) => action$.pipe(
  ofType(LOAD_COUNTERS),
  mergeMap(() =>
    from(loadCounters()).pipe(
      mergeMap(data =>
        concat(
          of(countersActionCreators.countersUpdated(data)),
          of(countersActionCreators.countersLoaded())
        )
      ),
      catchError(err =>
        of(countersActionCreators.countersError(err))
      )
    )
  )
);

export const saveCountersEpic: Epic = (action$, state$) => action$.pipe(
  ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER),
  debounceTime(1000),
  mergeMap(() =>
    from(saveCounters((state$.value as ICountersState).counters.list)).pipe(
      mergeMap(() =>
        of()
      ),
      catchError(err =>
        of(countersActionCreators.countersError(err))
      )
    )
  )
);

export const loadUsersEpic: Epic = (action$) => action$.pipe(
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
);

export const createUserEpic: Epic = (action$) => action$.pipe(
  ofType(CREATE_USER),
  mergeMap((action: CreateUser) =>
    from(createUser(action.payload)).pipe(
      mergeMap(data =>
        of(usersActionCreators.createUserCompleted(data))
      ),
      catchError(err =>
        of(usersActionCreators.usersError(err))
      )
    )
  )
);

export const updateUserEpic: Epic = (action$) => action$.pipe(
  ofType(UPDATE_USER),
  mergeMap((action: UpdateUser) =>
    from(updateUser(action.payload)).pipe(
      mergeMap(() =>
        of()
      ),
      catchError(err =>
        of(usersActionCreators.usersError(err))
      )
    )
  )
);

export const deleteUserEpic: Epic = (action$) => action$.pipe(
  ofType(DELETE_USER),
  mergeMap((action: DeleteUser) =>
    from(deleteUser(action.payload)).pipe(
      mergeMap(() =>
        of()
      ),
      catchError(err =>
        of(usersActionCreators.usersError(err))
      )
    )
  )
);

export default combineEpics(
  loadCountersEpic,
  saveCountersEpic,
  loadUsersEpic,
  createUserEpic,
  updateUserEpic,
  deleteUserEpic
);
