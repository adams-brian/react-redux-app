import { connect } from 'react-redux';
import { AppState, actionCreators, AppAction } from '../store';

import { UserList as UnwrappedUserList } from '../components/userList';
import { Dispatch } from 'redux';
import { push } from 'react-router-redux';

export const UserList = connect(
  (state: AppState) => 
    ({ list: state.users }),
  (dispatch: Dispatch<AppAction>) => ({
    deleteUser: (id: string) => dispatch(actionCreators.deleteUser(id)),
    editUser: (id: string) => { dispatch(push('/users/' + id)); }
  })
  )(UnwrappedUserList);
