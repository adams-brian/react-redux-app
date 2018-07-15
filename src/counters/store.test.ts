import { actionCreators, ADD_COUNTER, COUNTERS_ERROR, COUNTERS_LOADED,
  COUNTERS_UPDATED, DECREMENT, errorReducer, INCREMENT,
  listReducer, LOAD_COUNTERS, loadedReducer, REMOVE_COUNTER, RESET } from "./store";

const counters = [2,-2];

describe('store', () => {
  
  describe('actions', () => {

    it('should export action types', () => {
      expect(ADD_COUNTER).toMatchSnapshot();
      expect(COUNTERS_ERROR).toMatchSnapshot();
      expect(COUNTERS_LOADED).toMatchSnapshot();
      expect(COUNTERS_UPDATED).toMatchSnapshot();
      expect(DECREMENT).toMatchSnapshot();
      expect(INCREMENT).toMatchSnapshot();
      expect(LOAD_COUNTERS).toMatchSnapshot();
      expect(REMOVE_COUNTER).toMatchSnapshot();
      expect(RESET).toMatchSnapshot();
    });

  });

  describe('actionCreators', () => {
    
    it('should export actionCreators', () => {
      expect(actionCreators.addCounter()).toMatchSnapshot();
      expect(actionCreators.countersError(new Error('error message'))).toMatchSnapshot();
      expect(actionCreators.countersLoaded()).toMatchSnapshot();
      expect(actionCreators.countersUpdated(counters)).toMatchSnapshot();
      expect(actionCreators.decrement(1)).toMatchSnapshot();
      expect(actionCreators.increment(2)).toMatchSnapshot();
      expect(actionCreators.loadCounters()).toMatchSnapshot();
      expect(actionCreators.removeCounter(3)).toMatchSnapshot();
      expect(actionCreators.reset(4)).toMatchSnapshot();
    });

  });

  describe('listReducer', () => {

    it('should increment', () => {
      expect(listReducer(counters, actionCreators.increment(0))).toEqual([3,-2]);
      expect(listReducer(counters, actionCreators.increment(1))).toEqual([2,-1]);
    });

    it('should decrement', () => {
      expect(listReducer(counters, actionCreators.decrement(0))).toEqual([1,-2]);
      expect(listReducer(counters, actionCreators.decrement(1))).toEqual([2,-3]);
    });

    it('should reset', () => {
      expect(listReducer(counters, actionCreators.reset(0))).toEqual([0,-2]);
      expect(listReducer(counters, actionCreators.reset(1))).toEqual([2,0]);
    });

    it('should add counter', () => {
      expect(listReducer(undefined, actionCreators.addCounter())).toEqual([0]);
      expect(listReducer(counters, actionCreators.addCounter())).toEqual([2,-2,0]);
    });

    it('should remove counter', () => {
      expect(listReducer(counters, actionCreators.removeCounter(0))).toEqual([-2]);
      expect(listReducer(counters, actionCreators.removeCounter(1))).toEqual([2]);
    });

    it('should update counters', () => {
      const update = [5,1,4,2,3];
      expect(listReducer(undefined, actionCreators.countersUpdated(update))).toEqual(update);
      expect(listReducer(counters, actionCreators.countersUpdated(update))).toEqual(update);
    });

  });

  describe('loadedReducer', () => {

    it('should default to false', () => {
      expect(loadedReducer(undefined, actionCreators.addCounter())).toBe(false);
    });

    it('should return the state when not CountersLoaded', () => {
      expect(loadedReducer(false, actionCreators.addCounter())).toBe(false);
      expect(loadedReducer(true, actionCreators.addCounter())).toBe(true);
    });

    it('should return true when CountersLoaded', () => {
      expect(loadedReducer(undefined, actionCreators.countersLoaded())).toBe(true);
      expect(loadedReducer(false, actionCreators.countersLoaded())).toBe(true);
      expect(loadedReducer(true, actionCreators.countersLoaded())).toBe(true);
    });

  });

  describe('errorReducer', () => {

    it('should default to empty string', () => {
      expect(errorReducer(undefined, actionCreators.addCounter())).toEqual('');
    });

    it('should return the state when not CountersError', () => {
      const message = 'the error message';
      expect(errorReducer('', actionCreators.addCounter())).toEqual('');
      expect(errorReducer(message, actionCreators.addCounter())).toEqual(message);
    });

    it('should return the message from the Error when CountersError', () => {
      const err = new Error('the error message');
      expect(errorReducer(undefined, actionCreators.countersError(err))).toEqual(err.message);
      expect(errorReducer('different message', actionCreators.countersError(err))).toEqual(err.message);
    });

  });

});
