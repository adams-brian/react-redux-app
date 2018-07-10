import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { EditUser } from '../containers/editUser';
import { UserList } from '../containers/userList';

export const Users = () => (
  <Switch>
    <Route exact={true} path="/users" component={UserList}/>
    <Route exact={true} path="/users/createuser" component={EditUser}/>
    <Route path="/users/:id" component={EditUser}/>
  </Switch>
);
