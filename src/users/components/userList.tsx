import { push } from 'connected-react-router';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action, Dispatch } from 'redux';

import { actionCreators, IState, IUser, UsersAction } from '../store';
import UserListRow from './userListRow';

interface IUserListProps {
  list: IUser[];
  deleteUser: (id: string) => void;
  editUser: (id: string) => void;
}

export const UserList = (props: IUserListProps) => (
  <div className="users-container">
    <h1 className="users-header">Users</h1>
    <table className="table table-hover">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th style={{width: '1px'}}/>
        </tr>
      </thead>
      <tbody>
        {props.list.map(user =>
          <UserListRow 
            key={user._id}
            user={user}
            editUser={props.editUser}
            deleteUser={props.deleteUser}
          />
        )}
      </tbody>
    </table>
    <Link className="create-user" to="/users/createuser">
      <button type="button" className="btn btn-primary">Create User</button>
    </Link>
  </div>
);

export const mapStateToProps = (state: IState) => 
  ({ list: state.users.list });

export const mapDispatchToProps = (dispatch: Dispatch<UsersAction | Action<any>>) => ({
  deleteUser: (id: string) => dispatch(actionCreators.deleteUser(id)),
  editUser: (id: string) => { dispatch(push('/users/' + id)); }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( UserList );
