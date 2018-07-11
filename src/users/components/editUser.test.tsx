import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import { push } from 'react-router-redux';
import * as sinon from 'sinon';

import { actionCreators } from '../store';
import { EditUser, mapDispatchToProps, mapStateToProps } from './editUser';

describe("EditUser", () => {

  describe("component", () => {

    let element: JSX.Element;

    describe("create user mode", () => {

      const user = {
        _id: '',
        firstname: '',
        lastname: ''
      }
      let submit: sinon.SinonSpy;

      beforeEach(() => {
        submit = sinon.spy();
        element = (
          <EditUser
            user={user}
            submit={submit}
          />
        );
      });

      it('renders as expected', () => {
        const component = shallow(element);
        expect(component).toMatchSnapshot();
      });

      it('calls submit', () => {
        const component = shallow(element);
        expect(submit.called).toBe(false);
        component.find('#firstname').first().simulate('change', { currentTarget: { name: 'firstname', value: 'new' } });
        component.find('#lastname').first().simulate('change', { currentTarget: { name: 'lastname', value: 'user' } });
        component.find('button[type="submit"]').first().simulate('click', { preventDefault: () => { /* noop */ }});
        expect(submit.calledOnceWithExactly({ _id: '', firstname: 'new', lastname: 'user'})).toBe(true);
      });

    });

    describe("edit user mode", () => {

      const user = {
        _id: '123',
        firstname: 'abc',
        lastname: 'def'
      }
      let submit: sinon.SinonSpy;

      beforeEach(() => {
        submit = sinon.spy();
        element = (
          <EditUser
            user={user}
            submit={submit}
          />
        );
      });

      it('renders as expected', () => {
        const component = shallow(element);
        expect(component).toMatchSnapshot();
      });

      it('calls updateUser on the state', () => {
        const component = shallow(element);
        expect(submit.called).toBe(false);
        component.find('#firstname').first().simulate('change', { currentTarget: { name: 'firstname', value: 'updated' } });
        component.find('#lastname').first().simulate('change', { currentTarget: { name: 'lastname', value: 'user' } });
        component.find('button[type="submit"]').first().simulate('click', { preventDefault: () => { /* noop */ }});
        expect(submit.calledOnceWithExactly({ _id: '123', firstname: 'updated', lastname: 'user'})).toBe(true);
      });
      
    });

  });

  describe("connection", () => {

    const users = [
      {
        _id: '123',
        firstname: 'abc',
        lastname: 'def'
      },
      {
        _id: '456',
        firstname: 'hij',
        lastname: 'klm'
      },
      {
        _id: '789',
        firstname: 'nop',
        lastname: 'qrs'
      }
    ];

    it('should map state to props', () => {
      const getProps = (id: string) => 
        ({
          history: createMemoryHistory(),
          location: createLocation('/a/location'),
          match: {
            isExact: true,
            params: { id },
            path: '/a/location',
            url: 'urlbase/a/location'
          }
        });
      expect(mapStateToProps({ users }, getProps(''))).toEqual({
        user: {
          _id: '',
          firstname: '',
          lastname: ''
        }
      });
      expect(mapStateToProps({ users }, getProps('456'))).toEqual({
        user: {
          _id: '456',
          firstname: 'hij',
          lastname: 'klm'
        }
      });
    });

    it('dispatches submit for new user', () => {
      const dispatch = sinon.spy();
      const props = mapDispatchToProps(dispatch);
      expect(dispatch.called).toBe(false);
      const user = {
        _id: '',
        firstname: 'new',
        lastname: 'user'
      }
      props.submit(user);
      expect(dispatch.calledTwice).toBe(true);
      // can't use property matchers in typescript
      expect(dispatch.firstCall.args.length).toBe(1);
      const arg = dispatch.firstCall.args[0];
      expect(arg.payload._id.length > 0).toBe(true);
      delete arg.payload._id;
      expect(arg).toMatchSnapshot();
      expect(dispatch.secondCall.calledWithExactly(push('/users'))).toBe(true);
    });

    it('dispatches submit for an updated user', () => {
      const dispatch = sinon.spy();
      const props = mapDispatchToProps(dispatch);
      expect(dispatch.called).toBe(false);
      const user = {
        _id: '123',
        firstname: 'abc',
        lastname: 'def'
      }
      props.submit(user);
      expect(dispatch.calledTwice).toBe(true);
      expect(dispatch.firstCall.calledWithExactly(actionCreators.updateUser(user))).toBe(true);
      expect(dispatch.secondCall.calledWithExactly(push('/users'))).toBe(true);
    });

  });

});
