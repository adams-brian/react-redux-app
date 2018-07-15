import { shallow } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import { actionCreators } from '../store';
import { Counters, mapDispatchToProps, mapStateToProps } from './counters';

import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../../epics';
import { reducers } from '../store';
import ConnectedCounters from './counters';

describe("Counters", () => {

  const list = [5,1,4,2,3];
  const loaded = true;
  const error = '';
  const counters = { list, loaded, error };

  describe("component", () => {

    type propFunction = (index: number) => void;
    let element: JSX.Element;
    let addCounter: sinon.SinonSpy;
    let increment: sinon.SinonSpy;
    let decrement: sinon.SinonSpy;
    let reset: sinon.SinonSpy;
    let remove: sinon.SinonSpy;
    
    beforeEach(() => {
      addCounter = sinon.spy();
      increment = sinon.spy();
      decrement = sinon.spy();
      reset = sinon.spy();
      remove = sinon.spy();

      element = <Counters
        counters={[...list]}
        addCounter={addCounter}
        increment={increment}
        decrement={decrement}
        reset={reset}
        remove={remove}
      />
    });

    it('renders as expected', () => {
      const component = shallow(element);
      expect(component).toMatchSnapshot();
    });

    it('calls addCounter', () => {
      const component = shallow(element);
      expect(addCounter.called).toBe(false);
      component.find('.add-counter').simulate('click');
      expect(addCounter.calledOnce).toBe(true);
    });

    it('calls increment', () => {
      const component = shallow(element);
      expect(increment.called).toBe(false);
      const index = 1;
      (component.find('Counter').at(index).prop('increment') as propFunction)(index);
      expect(increment.calledOnceWithExactly(index)).toBe(true);
    });

    it('calls decrement', () => {
      const component = shallow(element);
      expect(decrement.called).toBe(false);
      const index = 2;
      (component.find('Counter').at(index).prop('decrement') as propFunction)(index);
      expect(decrement.calledOnceWithExactly(index)).toBe(true);
    });

    it('calls reset', () => {
      const component = shallow(element);
      expect(reset.called).toBe(false);
      const index = 3;
      (component.find('Counter').at(index).prop('reset') as propFunction)(index);
      expect(reset.calledOnceWithExactly(index)).toBe(true);
    });

    it('calls remove', () => {
      const component = shallow(element);
      expect(remove.called).toBe(false);
      const index = 4;
      (component.find('Counter').at(index).prop('remove') as propFunction)(index);
      expect(remove.calledOnceWithExactly(index)).toBe(true);
    });

  });

  describe('connection', () => {

    it('maps state to props', () => {
      expect(mapStateToProps({ counters })).toEqual({ counters: list, loaded, error });
    });
  
    it('maps dispatch to props', () => {
      expect(mapDispatchToProps).toEqual({ 
        addCounter: actionCreators.addCounter,
        decrement: actionCreators.decrement,
        increment: actionCreators.increment,
        load: actionCreators.loadCounters,
        remove: actionCreators.removeCounter,
        reset: actionCreators.reset
      });
    });

  });

  describe('connected component', () => {

    it('should render as expected', () => {
      const history = createMemoryHistory({ initialEntries: ['/counters'] });
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
            <ConnectedCounters />
          </ConnectedRouter>
        </Provider>
      );
      expect(component.find('loading(Counters)').first()).toMatchSnapshot();

      store.dispatch(actionCreators.countersUpdated([3,1,2]));
      store.dispatch(actionCreators.countersLoaded());
      component.update();
      expect(component.find('div[className="counters-container"]').first()).toMatchSnapshot();
    });

  });

});
