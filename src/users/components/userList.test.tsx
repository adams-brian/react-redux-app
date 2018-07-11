import { shallow } from 'enzyme';
import * as React from 'react';
import { push } from 'react-router-redux';
import * as sinon from 'sinon';

import { actionCreators } from '../store';
import { mapDispatchToProps, mapStateToProps, UserList } from './userList';

type propFunction = (id: string) => void;

const list = [
  {
    _id: '123',
    firstname: 'abc',
    lastname: 'def'
  },
  {
    _id: '456',
    firstname: 'hij',
    lastname: 'klm'
  }
];

describe("UserList", () => {
  
  describe("component", () => {

    let element: JSX.Element;
    let deleteUser: sinon.SinonSpy;
    let editUser: sinon.SinonSpy;
    
    beforeEach(() => {
      
      deleteUser = sinon.spy();
      editUser = sinon.spy();

      element = (
        <UserList
          list={list}
          deleteUser={deleteUser}
          editUser={editUser}
        />
      );
    });

    it('renders as expected', () => {
      const component = shallow(element);
      expect(component).toMatchSnapshot();
    });

    it('calls deleteUser', () => {
      const component = shallow(element);
      expect(deleteUser.called).toBe(false);
      (component.find('UserListRow').at(0).prop('deleteUser') as propFunction)('123');
      expect(deleteUser.calledOnceWithExactly('123')).toBe(true);
    });

    it('calls editUser', () => {
      const component = shallow(element);
      expect(editUser.called).toBe(false);
      (component.find('UserListRow').at(1).prop('editUser') as propFunction)('456');
      expect(editUser.calledOnceWithExactly('456')).toBe(true);
    });

  });

  describe("connection", () => {

    it('maps state to props', () => {
      expect(mapStateToProps({ users: list })).toEqual({ list });
    });
  
    it('dispatches deleteUser', () => {
      const dispatch = sinon.spy();
      const props = mapDispatchToProps(dispatch);
      expect(dispatch.called).toBe(false);
      props.deleteUser('5');
      expect(dispatch.calledOnceWithExactly(actionCreators.deleteUser('5'))).toBe(true);
    });

    it('dispatches editUser', () => {
      const dispatch = sinon.spy();
      const props = mapDispatchToProps(dispatch);
      expect(dispatch.called).toBe(false);
      props.editUser('5');
      expect(dispatch.calledOnceWithExactly(push('/users/5'))).toBe(true);
    });

  });
  
});
