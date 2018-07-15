import { shallow } from 'enzyme';
import * as React from 'react';

import { actionCreators } from '../store';
import EditUser from './editUser';
import UserList from './userList';
import { mapDispatchToProps, mapStateToProps, Users } from './users';

import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../../epics';
import { reducers } from '../store';
import ConnectedUsers from './users';

describe("Users", () => {

  describe('component', () => {

    let element: JSX.Element;

    beforeEach(() => {
      element = <Users />
    });

    it('renders as expected', () => {
      const component = shallow(element);
      expect(component).toMatchSnapshot();
    });

    it('routes /users to UserList', () => {
      const component = shallow(element);
      expect(component.find('Route[exact=true][path="/users"]').first().prop('component')).toBe(UserList);
    });

    it('routes /users/createuser to EditUser', () => {
      const component = shallow(element);
      expect(component.find('Route[exact=true][path="/users/createuser"]').first().prop('component')).toBe(EditUser);
    });

    it('routes /users/:id to EditUser', () => {
      const component = shallow(element);
      expect(component.find('Route[path="/users/:id"]').first().prop('component')).toBe(EditUser);
    });

  });

  describe('connection', () => {

    const state = {
      users: {
        error: 'the error message',
        list: [],
        loaded: true
      }
     }

    it('should map state to props', () => {
      expect(mapStateToProps(state)).toEqual({
        error: state.users.error,
        loaded: state.users.loaded
      });
    });

    it('should map dispatch to props', () => {
      expect(mapDispatchToProps).toEqual({
        load: actionCreators.loadUsers
      });
    });

  });

  describe('connected component', () => {

    it('should render as expected', () => {
      const history = createMemoryHistory({ initialEntries: ['/users'] });
      const epicMiddleware = createEpicMiddleware();
      const store = createStore(
        connectRouter(history)(
          combineReducers({
            ...reducers
          })
        ),
        applyMiddleware(
          routerMiddleware(history),
          epicMiddleware
        )
      );
      epicMiddleware.run(rootEpic);

      const component = mount(
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ConnectedUsers />
          </ConnectedRouter>
        </Provider>
      );
      expect(component.find('loading(Users)').first()).toMatchSnapshot();

      store.dispatch(actionCreators.usersUpdated([
        {
          _id: '123',
          firstname: 'abc',
          lastname: 'def'
        }
      ]));
      store.dispatch(actionCreators.usersLoaded());
      component.update();
      expect(component.find('div[className="users-container"]').first()).toMatchSnapshot();
    });

  });

});
