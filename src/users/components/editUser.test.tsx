import { push } from 'connected-react-router';
import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history';
import * as React from 'react';
import * as sinon from 'sinon';

import { actionCreators } from '../store';
import { EditUser, mapDispatchToProps, mapStateToProps } from './editUser';

describe("EditUser", () => {

  describe("component", () => {

    let element: JSX.Element;

    describe("create user mode", () => {

      const user = {
        firstname: '',
        id: '',
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
        expect(submit.calledOnceWithExactly({ id: '', firstname: 'new', lastname: 'user'})).toBe(true);
      });

    });

    describe("edit user mode", () => {

      const user = {
        firstname: 'abc',
        id: '123',
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
        expect(submit.calledOnceWithExactly({ id: '123', firstname: 'updated', lastname: 'user'})).toBe(true);
      });
      
    });

  });

  describe("connection", () => {

    const error = '';
    const list = [
      {
        firstname: 'abc',
        id: '123',
        lastname: 'def'
      },
      {
        firstname: 'hij',
        id: '456',
        lastname: 'klm'
      },
      {
        firstname: 'nop',
        id: '789',
        lastname: 'qrs'
      }
    ];
    const loaded = true;
    const users = { error, list, loaded };

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
          firstname: '',
          id: '',
          lastname: ''
        }
      });
      expect(mapStateToProps({ users }, getProps('456'))).toEqual({
        user: {
          firstname: 'hij',
          id: '456',
          lastname: 'klm'
        }
      });
    });

    it('dispatches submit for new user', () => {
      const dispatch = sinon.spy();
      const props = mapDispatchToProps(dispatch);
      expect(dispatch.called).toBe(false);
      const user = {
        firstname: 'new',
        id: '',
        lastname: 'user'
      }
      props.submit(user);
      expect(dispatch.calledTwice).toBe(true);
      // can't use property matchers in typescript
      expect(dispatch.firstCall.args.length).toBe(1);
      const arg = dispatch.firstCall.args[0];
      expect(arg.payload.id.length > 0).toBe(true);
      delete arg.payload.id;
      expect(arg).toMatchSnapshot();
      expect(dispatch.secondCall.calledWithExactly(push('/users'))).toBe(true);
    });

    it('dispatches submit for an updated user', () => {
      const dispatch = sinon.spy();
      const props = mapDispatchToProps(dispatch);
      expect(dispatch.called).toBe(false);
      const user = {
        firstname: 'abc',
        id: '123',
        lastname: 'def'
      }
      props.submit(user);
      expect(dispatch.calledTwice).toBe(true);
      expect(dispatch.firstCall.calledWithExactly(actionCreators.updateUser(user))).toBe(true);
      expect(dispatch.secondCall.calledWithExactly(push('/users'))).toBe(true);
    });

  });

});
