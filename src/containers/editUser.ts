import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';
import { generate } from 'shortid';

import { EditUser as UnwrappedEditUser } from '../components/editUser';
import { actionCreators, AppAction, IAppState, IUser } from '../store';

export const EditUser = connect(
  (state: IAppState, props: RouteComponentProps<{ id: string }>) => 
    state.users.find(u => u._id === props.match.params.id) || { _id: '', firstname: '', lastname: '' } as IUser,
  (dispatch: Dispatch<AppAction>) => ({
    submit: (u: IUser) => {
      if (u._id && u._id.length > 0) {
        dispatch(actionCreators.updateUser(u));
      }
      else {
        dispatch(actionCreators.createUser(Object.assign({}, u, { _id: generate() })));
      }
      dispatch(push('/users'));
    }
  })
  )(UnwrappedEditUser);
