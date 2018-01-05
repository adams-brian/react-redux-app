import { connect, Dispatch } from 'react-redux';
import { AppState, actionCreators } from '../store';
import { RouteComponentProps } from 'react-router';
import { generate } from 'shortid';
import { push } from 'react-router-redux';

import { EditUser as UnwrappedEditUser } from '../components/editUser';
import { User, AppAction } from '../store';

export const EditUser = connect(
  (state: AppState, props: RouteComponentProps<{ id: string }>) => 
    state.users.find(u => u._id === props.match.params.id) || { _id: '', firstname: '', lastname: '' } as User,
  (dispatch: Dispatch<AppAction>) => ({
    submit: (u: User) => {
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
