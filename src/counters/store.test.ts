import { actionCreators, ADD_COUNTER, COUNTERS_UPDATED, DECREMENT, INCREMENT,
  listReducer, REMOVE_COUNTER, RESET } from "./store";

const counters = [2,-2];

describe('store', () => {
  
  describe('actions', () => {

    it('should export action types', () => {
      expect(ADD_COUNTER).toMatchSnapshot();
      expect(COUNTERS_UPDATED).toMatchSnapshot();
      expect(DECREMENT).toMatchSnapshot();
      expect(INCREMENT).toMatchSnapshot();
      expect(REMOVE_COUNTER).toMatchSnapshot();
      expect(RESET).toMatchSnapshot();
    });

  });

  describe('actionCreators', () => {
    
    it('should export actionCreators', () => {
      expect(actionCreators.addCounter()).toMatchSnapshot();
      expect(actionCreators.countersUpdated(counters)).toMatchSnapshot();
      expect(actionCreators.decrement(1)).toMatchSnapshot();
      expect(actionCreators.increment(2)).toMatchSnapshot();
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

});
