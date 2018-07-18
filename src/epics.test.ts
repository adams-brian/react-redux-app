import { Action } from 'redux';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { Subject } from 'rxjs';
import * as sinon from 'sinon';

import * as countersApi from './counters/api';
import { actionCreators as countersActions } from './counters/store';
import { createUserEpic, deleteUserEpic, loadCountersEpic,
  loadUsersEpic, saveCountersEpic, updateUserEpic } from './epics';
import * as usersApi from './users/api';
import { actionCreators as usersActions } from './users/store';

describe('epics', () => {

  let actionSubject: Subject<Action>;
  let action$: ActionsObservable<Action>;
  let stateSubject: Subject<any>;
  let state$: StateObservable<any>;
  let output: Action[];

  beforeEach(() => {
    actionSubject = new Subject<Action>();
    action$ = ActionsObservable.from(actionSubject);
    stateSubject = new Subject<any>();
    state$ = new StateObservable(stateSubject, {});
    output = [];
  })

  describe('loadCountersEpics', () => {

    let loadCountersStub: sinon.SinonStub;
    const createLoadCountersStub = (fake: () => void) => 
      sinon.stub(countersApi, 'loadCounters').callsFake(fake)

    beforeEach(() => {
      loadCountersStub = createLoadCountersStub(
        () => Promise.resolve([5,1,4,2,3])
      );
      loadCountersEpic(action$, state$, undefined).subscribe(
        a => output.push(a)
      );
    });

    afterEach(() => {
      loadCountersStub.restore();
    });

    it('should dispatch CountersUpdated and CountersLoaded on LoadCounters if loadCounters succeeds', () => {
      actionSubject.next(countersActions.loadCounters());
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(loadCountersStub.calledOnce).toBe(true);
      });
    });

    it('should dispatch CountersError if loadCounters rejects', () => {
      // replace the standard stub with one that rejects
      loadCountersStub.restore();
      loadCountersStub = createLoadCountersStub(
        () => Promise.reject('error in loadCounters')
      );
      actionSubject.next(countersActions.loadCounters());
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(loadCountersStub.calledOnce).toBe(true);
      });
    });
  
    it('should do nothing on other actions', () => {
      actionSubject.next(countersActions.addCounter());
      actionSubject.next(countersActions.removeCounter(1));
      actionSubject.next(countersActions.countersUpdated([3,2,1]));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(loadCountersStub.called).toBe(false);
      });
    });

  });

  describe('saveCountersEpic', () => {

    let clock: sinon.SinonFakeTimers;
    const list = [3,1,2];
    let saveCountersStub: sinon.SinonStub;
    const createSaveCountersStub = (fake: () => void) => 
      sinon.stub(countersApi, 'saveCounters').callsFake(fake)
    
    const testSaveCalled = (action: Action<any>) => {
      actionSubject.next(action);
      return Promise.resolve()
      .then(() => {
        expect(output).toEqual([]);
        expect(saveCountersStub.called).toBe(false);
        clock.tick(1000);
      })
      .then(() => {
        expect(output).toEqual([]);
        expect(saveCountersStub.calledOnceWithExactly(list)).toBe(true);
      });
    }

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      saveCountersStub = createSaveCountersStub(
        () => Promise.resolve()
      );
      stateSubject.next({ counters: { list } });
      saveCountersEpic(action$, state$, undefined).subscribe(
        a => output.push(a)
      );
    });

    afterEach(() => {
      saveCountersStub.restore();
      clock.restore();
    });

    it('should call saveCounters on Increment', () => {
      testSaveCalled(countersActions.increment(1));
    });

    it('should call saveCounters on Decrement', () => {
      testSaveCalled(countersActions.decrement(1));
    });

    it('should call saveCounters on Reset', () => {
      testSaveCalled(countersActions.reset(1));
    });

    it('should call saveCounters on AddCounter', () => {
      testSaveCalled(countersActions.addCounter());
    });

    it('should call saveCounters on RemoveCounter', () => {
      testSaveCalled(countersActions.removeCounter(1));
    });

    it('should call saveCounters on a 1 second debounce', () => {
      actionSubject.next(countersActions.increment(1));
      actionSubject.next(countersActions.increment(1));
      return Promise.resolve()
      .then(() => {
        expect(saveCountersStub.called).toBe(false);
        clock.tick(900);
      })
      .then(() => {
        actionSubject.next(countersActions.decrement(0));
        actionSubject.next(countersActions.removeCounter(2));
        expect(saveCountersStub.called).toBe(false);
        clock.tick(900);
      })
      .then(() => {
        actionSubject.next(countersActions.reset(0));
        actionSubject.next(countersActions.addCounter());
        actionSubject.next(countersActions.removeCounter(2));
        expect(saveCountersStub.called).toBe(false);
        clock.tick(1000);
      })
      .then(() => {
        expect(output).toEqual([]);
        expect(saveCountersStub.calledOnceWithExactly(list)).toBe(true);
      });
    });

    it('should dispatch CountersError if saveCounters rejects', () => {
      // replace the standard stub with one that rejects
      saveCountersStub.restore();
      saveCountersStub = createSaveCountersStub(
        () => Promise.reject('error in saveCounters')
      );
      actionSubject.next(countersActions.addCounter());
      clock.tick(1000);
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(saveCountersStub.calledOnceWithExactly(list)).toBe(true);
      });
    });
  
    it('should do nothing on other actions', () => {
      actionSubject.next(countersActions.countersUpdated([3,1,2]));
      actionSubject.next(countersActions.countersLoaded());
      actionSubject.next(countersActions.loadCounters());
      actionSubject.next(countersActions.countersError(new Error('an error')));
      clock.tick(1000);
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(saveCountersStub.called).toBe(false);
      });

    });

  });

  describe('loadUsersEpic', () => {

    const list = [
      {
        firstname: 'abc',
        id: '123',
        lastname: 'def'
      },
      {
        firstname: 'ghi',
        id: '456',
        lastname: 'jkl'
      }
    ];
    let loadUsersStub: sinon.SinonStub;
    const createLoadUsersStub = (fake: () => void) => 
      sinon.stub(usersApi, 'loadUsers').callsFake(fake)
    
    beforeEach(() => {
      loadUsersStub = createLoadUsersStub(
        () => Promise.resolve(list)
      );
      loadUsersEpic(action$, state$, undefined).subscribe(
        a => output.push(a)
      );
    });

    afterEach(() => {
      loadUsersStub.restore();
    });

    it('should dispatch UsersUpdated and UsersLoaded on LoadUsers if loadUsers succeeds', () => {
      actionSubject.next(usersActions.loadUsers());
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(loadUsersStub.calledOnce).toBe(true);
      });
    });

    it('should dispatch UsersError if loadUsers rejects', () => {
      loadUsersStub.restore();
      loadUsersStub = createLoadUsersStub(
        () => Promise.reject('error in loadUsers')
      );
      actionSubject.next(usersActions.loadUsers());
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(loadUsersStub.calledOnce).toBe(true);
      });
    });
  
    it('should do nothing on other actions', () => {
      actionSubject.next(usersActions.deleteUser('1'));
      actionSubject.next(usersActions.usersError(new Error('an error')));
      actionSubject.next(usersActions.usersLoaded());
      actionSubject.next(usersActions.usersUpdated([]));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(loadUsersStub.called).toBe(false);
      });
    });

  });

  describe('createUserEpic', () => {

    const user = {
      firstname: 'abc',
      id: '123',
      lastname: 'def'
    }
    let createUserStub: sinon.SinonStub;
    const createCreateUserStub = (fake: () => void) => 
      sinon.stub(usersApi, 'createUser').callsFake(fake)
    
    beforeEach(() => {
      createUserStub = createCreateUserStub(
        () => Promise.resolve('987')
      );
      createUserEpic(action$, state$, undefined).subscribe(
        a => output.push(a)
      );
    });

    afterEach(() => {
      createUserStub.restore();
    });

    it('should call createUser on CreateUser', () => {
      actionSubject.next(usersActions.createUser(user));
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(createUserStub.calledOnceWithExactly(user)).toBe(true);
      });
    });

    it('should dispatch UsersError if createUser rejects', () => {
      createUserStub.restore();
      createUserStub = createCreateUserStub(
        () => Promise.reject('error in createUser')
      );
      actionSubject.next(usersActions.createUser(user));
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(createUserStub.calledOnceWithExactly(user)).toBe(true);
      });
    });
  
    it('should do nothing on other actions', () => {
      actionSubject.next(usersActions.deleteUser('1'));
      actionSubject.next(usersActions.usersError(new Error('an error')));
      actionSubject.next(usersActions.usersLoaded());
      actionSubject.next(usersActions.usersUpdated([]));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(createUserStub.called).toBe(false);
      });
    });

  });

  describe('updateUserEpic', () => {

    const user = {
      firstname: 'abc',
      id: '123',
      lastname: 'def'
    }
    let updateUserStub: sinon.SinonStub;
    const createUpdateUserStub = (fake: () => void) => 
      sinon.stub(usersApi, 'updateUser').callsFake(fake)
    
    beforeEach(() => {
      updateUserStub = createUpdateUserStub(
        () => Promise.resolve()
      );
      updateUserEpic(action$, state$, undefined).subscribe(
        a => output.push(a)
      );
    });

    afterEach(() => {
      updateUserStub.restore();
    });

    it('should call updateUser on UpdateUser', () => {
      actionSubject.next(usersActions.updateUser(user));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(updateUserStub.calledOnceWithExactly(user)).toBe(true);
      });
    });

    it('should dispatch UsersError if updateUser rejects', () => {
      updateUserStub.restore();
      updateUserStub = createUpdateUserStub(
        () => Promise.reject('error in updateUser')
      );
      actionSubject.next(usersActions.updateUser(user));
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(updateUserStub.calledOnceWithExactly(user)).toBe(true);
      });
    });
  
    it('should do nothing on other actions', () => {
      actionSubject.next(usersActions.deleteUser('1'));
      actionSubject.next(usersActions.usersError(new Error('an error')));
      actionSubject.next(usersActions.usersLoaded());
      actionSubject.next(usersActions.usersUpdated([]));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(updateUserStub.called).toBe(false);
      });
    });

  });

  describe('deleteUserEpic', () => {

    const id = '123';
    let deleteUserStub: sinon.SinonStub;
    const createDeleteUserStub = (fake: () => void) => 
      sinon.stub(usersApi, 'deleteUser').callsFake(fake)
    
    beforeEach(() => {
      deleteUserStub = createDeleteUserStub(
        () => Promise.resolve()
      );
      deleteUserEpic(action$, state$, undefined).subscribe(
        a => output.push(a)
      );
    });

    afterEach(() => {
      deleteUserStub.restore();
    });

    it('should call deleteUser on DeleteUser', () => {
      actionSubject.next(usersActions.deleteUser(id));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(deleteUserStub.calledOnceWithExactly(id)).toBe(true);
      });
    });

    it('should dispatch UsersError if deleteUser rejects', () => {
      deleteUserStub.restore();
      deleteUserStub = createDeleteUserStub(
        () => Promise.reject('error in deleteUser')
      );
      actionSubject.next(usersActions.deleteUser(id));
      return Promise.resolve().then(() => {
        expect(output).toMatchSnapshot();
        expect(deleteUserStub.calledOnceWithExactly(id)).toBe(true);
      });
    });
  
    it('should do nothing on other actions', () => {
      actionSubject.next(usersActions.usersError(new Error('an error')));
      actionSubject.next(usersActions.usersLoaded());
      actionSubject.next(usersActions.usersUpdated([]));
      return Promise.resolve().then(() => {
        expect(output).toEqual([]);
        expect(deleteUserStub.called).toBe(false);
      });
    });

  });

});