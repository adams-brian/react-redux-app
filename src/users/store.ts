import { Action, combineReducers } from 'redux';

export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
}

export interface IState {
  users: {
    error: string;
    list: IUser[];
    loaded: boolean;
  }
}

/* tslint:disable:max-classes-per-file */
export const CREATE_USER = '[Users] CREATE';
export class CreateUser implements Action {
  public readonly type = CREATE_USER;
  constructor(public payload: IUser) { }
}
export const UPDATE_USER = '[Users] UPDATE';
export class UpdateUser implements Action {
  public readonly type = UPDATE_USER;
  constructor(public payload: IUser) { }
}
export const DELETE_USER = '[Users] DELETE';
export class DeleteUser implements Action {
  public readonly type = DELETE_USER;
  constructor(public payload: string) { }
}
export const USERS_UPDATED = '[Users] USERS UPDATED';
class UsersUpdated implements Action {
  public readonly type = USERS_UPDATED;
  constructor(public payload: IUser[]) { }
}
export const LOAD_USERS = '[Users] LOAD USERS';
export class LoadUsers implements Action {
  public readonly type = LOAD_USERS;
}
export const USERS_ERROR = '[Users] USERS ERROR';
export class UsersError implements Action {
  public readonly type = USERS_ERROR;
  constructor(public payload: Error) { }
}
export const USERS_LOADED = '[Users] USERS LOADED';
export class UsersLoaded implements Action {
  public readonly type = USERS_LOADED;
}
export type UsersAction = CreateUser | UpdateUser | DeleteUser | UsersUpdated | LoadUsers | UsersError | UsersLoaded;

export const actionCreators = {
  createUser: (user: IUser) => Object.assign({}, new CreateUser(user)),
  deleteUser: (id: string) => Object.assign({}, new DeleteUser(id)),
  loadUsers: () => Object.assign({}, new LoadUsers()),
  updateUser: (user: IUser) => Object.assign({}, new UpdateUser(user)),
  usersError: (err: Error) => Object.assign({}, new UsersError(err)),
  usersLoaded: () => Object.assign({}, new UsersLoaded()),
  usersUpdated: (users: IUser[]) => Object.assign({}, new UsersUpdated(users)),
};

export const listReducer = (state: IUser[] = [], action: UsersAction) => {
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

export const loadedReducer = (state: boolean = false, action: UsersAction) => {
  switch (action.type) {
    case USERS_LOADED:
      return true;
    default:
      return state;
  }
}

export const errorReducer = (state: string = '', action: UsersAction) => {
  switch (action.type) {
    case USERS_ERROR:
      return action.payload.message;
    default:
      return state;
  }
}

export const reducers = {
  users: combineReducers({
    error: errorReducer,
    list: listReducer,
    loaded: loadedReducer
  })
};
