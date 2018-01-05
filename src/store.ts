import { LocationChangeAction } from 'react-router-redux';

export interface User { 
  _id: string;
  firstname: string;
  lastname: string;
}

export interface AppState {
  loading: boolean;
  counters: number[];
  users: Array<User>;
}

interface Action {
  type: string;
}

export const START_LOADING = '[App] START LOADING';
class StartLoading implements Action {
  readonly type = START_LOADING;
}
export const DONE_LOADING = '[App] DONE LOADING';
class DoneLoading implements Action {
  readonly type = DONE_LOADING;
}
type LoadingAction = StartLoading | DoneLoading;

abstract class ActionWithNumberPayload implements Action {
  readonly type: string;
  constructor(public payload: number) {}
}
export const INCREMENT = '[Counters] INCREMENT';
class Increment extends ActionWithNumberPayload {
  readonly type = INCREMENT;
}
export const DECREMENT = '[Counters] DECREMENT';
class Decrement extends ActionWithNumberPayload {
  readonly type = DECREMENT;
}
export const RESET = '[Counters] RESET';
class Reset extends ActionWithNumberPayload {
  readonly type = RESET;
}
export const ADD_COUNTER = '[Counters] ADD COUNTER';
class AddCounter implements Action {
  readonly type = ADD_COUNTER;
}
export const REMOVE_COUNTER = '[Counters] REMOVE COUNTER';
class RemoveCounter extends ActionWithNumberPayload {
  readonly type = REMOVE_COUNTER;
}
export const COUNTERS_UPDATED = '[Counters] COUNTERS UPDATED';
class CountersUpdated implements Action {
  readonly type = COUNTERS_UPDATED;
  constructor(public payload: number[]) {}
}
type CounterAction = Increment | Decrement | Reset | AddCounter | RemoveCounter | CountersUpdated;

export const CREATE_USER = '[Users] CREATE';
export class CreateUser implements Action {
  readonly type = CREATE_USER;
  constructor(public payload: User) {}
}
export const UPDATE_USER = '[Users] UPDATE';
class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: User) {}
}
export const DELETE_USER = '[Users] DELETE';
export class DeleteUser implements Action {
  readonly type = DELETE_USER;
  constructor(public payload: string) {}
}
export const USERS_UPDATED = '[Users] USERS UPDATED';
class UsersUpdated implements Action {
  readonly type = USERS_UPDATED;
  constructor(public payload: Array<User>) {}
}
type UserAction = CreateUser | UpdateUser | DeleteUser | UsersUpdated;

export const actionCreators = {
  startLoading: () => Object.assign({}, new StartLoading()),
  doneLoading: () => Object.assign({}, new DoneLoading()),

  increment: (index: number) => Object.assign({}, new Increment(index)),
  decrement: (index: number) => Object.assign({}, new Decrement(index)),
  reset: (index: number) => Object.assign({}, new Reset(index)),
  addCounter: () => Object.assign({}, new AddCounter()),
  removeCounter: (index: number) => Object.assign({}, new RemoveCounter(index)),
  countersUpdated: (counters: number[]) => Object.assign({}, new CountersUpdated(counters)),

  createUser: (user: User) => Object.assign({}, new CreateUser(user)),
  updateUser: (user: User) => Object.assign({}, new UpdateUser(user)),
  deleteUser: (id: string) => Object.assign({}, new DeleteUser(id)),
  usersUpdated: (users: Array<User>) => Object.assign({}, new UsersUpdated(users)),
};

function loadingReducer(state: boolean = false, action: LoadingAction) {
  switch (action.type) {
    case START_LOADING:
      return true;
    case DONE_LOADING:
      return false;
    default:
      return state;
  }
}

function countersReducer(state: number[] = [], action: CounterAction) {
  switch (action.type) {
    case INCREMENT:
      return [
        ...state.slice(0, action.payload),
        state[action.payload] + 1,
        ...state.slice(action.payload + 1)
      ];
    case DECREMENT:
      return [
        ...state.slice(0, action.payload),
        state[action.payload] - 1,
        ...state.slice(action.payload + 1)
      ];
    case RESET:
      return [
        ...state.slice(0, action.payload),
        0,
        ...state.slice(action.payload + 1)
      ];
    case ADD_COUNTER:
      return [...state, 0];
    case REMOVE_COUNTER:
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1)
      ];
    case COUNTERS_UPDATED:
      return [...action.payload];
    default:
      return state;
  }
}

const usersReducer = (state: User[] = [], action: UserAction) => {
  switch (action.type) {
    case CREATE_USER:
      return [...state, action.payload];
    case UPDATE_USER:
      return state.map(user => user._id === action.payload._id ? Object.assign({}, action.payload) : user);
    case DELETE_USER:
      return state.filter(user => user._id !== action.payload);
    case USERS_UPDATED:
      return [...action.payload];
    default:
      return state;
  }
};

export const reducers = { 
  loading: loadingReducer,
  counters: countersReducer,
  users: usersReducer
};

export type AppAction = LoadingAction | CounterAction | UserAction | LocationChangeAction;
