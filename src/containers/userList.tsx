import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

import { UserList as UnwrappedUserList } from '../components/userList';
import { actionCreators, AppAction, IAppState } from '../store';

export const UserList = connect(
  (state: IAppState) => 
    ({ list: state.users }),
  (dispatch: Dispatch<AppAction>) => ({
    deleteUser: (id: string) => dispatch(actionCreators.deleteUser(id)),
    editUser: (id: string) => { dispatch(push('/users/' + id)); }
  })
  )(UnwrappedUserList);
