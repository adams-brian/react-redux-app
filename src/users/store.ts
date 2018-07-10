import { IAction } from '../store';

export interface IUser { 
  _id: string;
  firstname: string;
  lastname: string;
}

export interface IState {
  users: IUser[]
}

/* tslint:disable:max-classes-per-file */
export const CREATE_USER = '[Users] CREATE';
export class CreateUser implements IAction {
  public readonly type = CREATE_USER;
  constructor(public payload: IUser) {}
}
export const UPDATE_USER = '[Users] UPDATE';
export class UpdateUser implements IAction {
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
export type UsersAction = CreateUser | UpdateUser | DeleteUser | UsersUpdated;

export const actionCreators = {
  createUser: (user: IUser) => Object.assign({}, new CreateUser(user)),
  deleteUser: (id: string) => Object.assign({}, new DeleteUser(id)),
  updateUser: (user: IUser) => Object.assign({}, new UpdateUser(user)),
  usersUpdated: (users: IUser[]) => Object.assign({}, new UsersUpdated(users)),
};

const usersReducer = (state: IUser[] = [], action: UsersAction) => {
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
  users: usersReducer
}
