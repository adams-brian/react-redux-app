import { LocationChangeAction } from 'react-router-redux';

export interface IUser { 
  _id: string;
  firstname: string;
  lastname: string;
}

export interface IAppState {
  loading: boolean;
  counters: number[];
  users: IUser[];
}

interface IAction {
  type: string;
}

/* tslint:disable:max-classes-per-file */
export const START_LOADING = '[App] START LOADING';
class StartLoading implements IAction {
  public readonly type = START_LOADING;
}
export const DONE_LOADING = '[App] DONE LOADING';
class DoneLoading implements IAction {
  public readonly type = DONE_LOADING;
}
type LoadingAction = StartLoading | DoneLoading;

abstract class ActionWithNumberPayload implements IAction {
  public readonly type: string;
  constructor(public payload: number) {}
}
export const INCREMENT = '[Counters] INCREMENT';
class Increment extends ActionWithNumberPayload {
  public readonly type = INCREMENT;
}
export const DECREMENT = '[Counters] DECREMENT';
class Decrement extends ActionWithNumberPayload {
  public readonly type = DECREMENT;
}
export const RESET = '[Counters] RESET';
class Reset extends ActionWithNumberPayload {
  public readonly type = RESET;
}
export const ADD_COUNTER = '[Counters] ADD COUNTER';
class AddCounter implements IAction {
  public readonly type = ADD_COUNTER;
}
export const REMOVE_COUNTER = '[Counters] REMOVE COUNTER';
class RemoveCounter extends ActionWithNumberPayload {
  public readonly type = REMOVE_COUNTER;
}
export const COUNTERS_UPDATED = '[Counters] COUNTERS UPDATED';
class CountersUpdated implements IAction {
  public readonly type = COUNTERS_UPDATED;
  constructor(public payload: number[]) {}
}
type CounterAction = Increment | Decrement | Reset | AddCounter | RemoveCounter | CountersUpdated;

export const CREATE_USER = '[Users] CREATE';
export class CreateUser implements IAction {
  public readonly type = CREATE_USER;
  constructor(public payload: IUser) {}
}
export const UPDATE_USER = '[Users] UPDATE';
class UpdateUser implements IAction {
  public readonly type = UPDATE_USER;
  constructor(public payload: IUser) {}
}
export const DELETE_USER = '[Users] DELETE';
export class DeleteUser implements IAction {
  public readonly type = DELETE_USER;
  constructor(public payload: string) {}
}
export const USERS_UPDATED = '[Users] USERS UPDATED';
class UsersUpdated implements IAction {
  public readonly type = USERS_UPDATED;
  constructor(public payload: IUser[]) {}
}
type UserAction = CreateUser | UpdateUser | DeleteUser | UsersUpdated;

export const actionCreators = {
  doneLoading: () => Object.assign({}, new DoneLoading()),
  startLoading: () => Object.assign({}, new StartLoading()),

  addCounter: () => Object.assign({}, new AddCounter()),
  countersUpdated: (counters: number[]) => Object.assign({}, new CountersUpdated(counters)),
  decrement: (index: number) => Object.assign({}, new Decrement(index)),
  increment: (index: number) => Object.assign({}, new Increment(index)),
  removeCounter: (index: number) => Object.assign({}, new RemoveCounter(index)),
  reset: (index: number) => Object.assign({}, new Reset(index)),

  createUser: (user: IUser) => Object.assign({}, new CreateUser(user)),
  deleteUser: (id: string) => Object.assign({}, new DeleteUser(id)),
  updateUser: (user: IUser) => Object.assign({}, new UpdateUser(user)),
  usersUpdated: (users: IUser[]) => Object.assign({}, new UsersUpdated(users)),
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

const usersReducer = (state: IUser[] = [], action: UserAction) => {
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
  counters: countersReducer,
  loading: loadingReducer,
  users: usersReducer
};

export type AppAction = LoadingAction | CounterAction | UserAction | LocationChangeAction;
