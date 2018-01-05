import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { UserList } from '../containers/userList';
import { EditUser } from '../containers/editUser';

export const Users = () => (
  <Switch>
    <Route exact={true} path="/users" component={UserList}/>
    <Route exact={true} path="/users/createuser" component={EditUser}/>
    <Route path="/users/:id" component={EditUser}/>
  </Switch>
);
