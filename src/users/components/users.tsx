import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import loading, { IDispatchProps, IStateProps } from '../../common/components/loading';
import { actionCreators, IState } from '../store';
import EditUser from './editUser';
import UserList from './userList';

export const Users = () =>
  <Switch>
    <Route exact={true} path="/users" component={UserList}/>
    <Route exact={true} path="/users/createuser" component={EditUser}/>
    <Route path="/users/:id" component={EditUser}/>
  </Switch>

export const mapStateToProps = (state: IState) => ({
  error: state.users.error,
  loaded: state.users.loaded
});

export const mapDispatchToProps = {
  load: actionCreators.loadUsers
};

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(
  loading(Users)
);
