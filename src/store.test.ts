import { actionCreators, DONE_LOADING, LoadingAction, reducers, START_LOADING } from "./store";

describe('store', () => {
  
  describe('actions', () => {

    it('should export action types', () => {
      expect(START_LOADING).toMatchSnapshot();
      expect(DONE_LOADING).toMatchSnapshot();
    });

  });

  describe('actionCreators', () => {
    
    it('should export actionCreators', () => {
      expect(actionCreators.doneLoading()).toMatchSnapshot();
      expect(actionCreators.startLoading()).toMatchSnapshot();
    });

  });

  describe('reducer', () => {

    it('should return true when starting to load', () => {
      expect(reducers.loading(undefined, actionCreators.startLoading())).toBe(true);
      expect(reducers.loading(false, actionCreators.startLoading())).toBe(true);
      expect(reducers.loading(true, actionCreators.startLoading())).toBe(true);
    });

    it('should return false when done loading', () => {
      expect(reducers.loading(undefined, actionCreators.doneLoading())).toBe(false);
      expect(reducers.loading(false, actionCreators.doneLoading())).toBe(false);
      expect(reducers.loading(true, actionCreators.doneLoading())).toBe(false);
    });

  });

});