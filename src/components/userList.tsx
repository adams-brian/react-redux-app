import * as React from 'react';
import { Link } from 'react-router-dom';

import { IUser } from '../store';

interface IUserListProps {
  list: IUser[];
  deleteUser: (id: string) => void;
  editUser: (id: string) => void;
}

/* tslint:disable:jsx-no-lambda */
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
        {props.list.map(user => (
          <tr key={user._id} onClick={() => props.editUser(user._id)}>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>
              <button onClick={(e) => { e.stopPropagation(); props.deleteUser(user._id); }}>
                <span className="fa fa-times"/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Link className="create-user" to="/users/createuser">
      <button type="button" className="btn btn-primary">Create User</button>
    </Link>
  </div>
);
