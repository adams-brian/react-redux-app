import { Action, combineReducers } from 'redux';

export interface IState {
  counters: {
    error: string;
    list: number[];
    loaded: boolean;
  }
}

/* tslint:disable:max-classes-per-file */
abstract class ActionWithNumberPayload implements Action {
  public readonly type: string;
  constructor(public payload: number) {}
}
export const INCREMENT = '[Counters] INCREMENT';
class Increment extends ActionWithNumberPayload {
  public readonly type = INCREMENT;
}
export const DECREMENT = '[Counters] DECREMENT';
class Decrement extends ActionWithNumberPayload {
  public readonly type = DECREMENT;
}
export const RESET = '[Counters] RESET';
class Reset extends ActionWithNumberPayload {
  public readonly type = RESET;
}
export const ADD_COUNTER = '[Counters] ADD COUNTER';
class AddCounter implements Action {
  public readonly type = ADD_COUNTER;
}
export const REMOVE_COUNTER = '[Counters] REMOVE COUNTER';
class RemoveCounter extends ActionWithNumberPayload {
  public readonly type = REMOVE_COUNTER;
}
export const COUNTERS_UPDATED = '[Counters] COUNTERS UPDATED';
class CountersUpdated implements Action {
  public readonly type = COUNTERS_UPDATED;
  constructor(public payload: number[]) {}
}
export const LOAD_COUNTERS = '[Counters] LOAD COUNTERS';
export class LoadCounters implements Action {
  public readonly type = LOAD_COUNTERS;
}
export const COUNTERS_ERROR = '[Counters] COUNTERS ERROR';
export class CountersError implements Action {
  public readonly type = COUNTERS_ERROR;
  constructor(public payload: Error) {}
}
export const COUNTERS_LOADED = '[Counters] COUNTERS LOADED';
export class CountersLoaded implements Action {
  public readonly type = COUNTERS_LOADED;
}
export type CountersAction = Increment | Decrement | Reset | AddCounter | RemoveCounter |
  CountersUpdated | LoadCounters | CountersError | CountersLoaded;

export const actionCreators = {
  addCounter: () => Object.assign({}, new AddCounter()),
  countersError: (err: Error) => Object.assign({}, new CountersError(err)),
  countersLoaded: () => Object.assign({}, new CountersLoaded()),
  countersUpdated: (counters: number[]) => Object.assign({}, new CountersUpdated(counters)),
  decrement: (index: number) => Object.assign({}, new Decrement(index)),
  increment: (index: number) => Object.assign({}, new Increment(index)),
  loadCounters: () => Object.assign({}, new LoadCounters()),
  removeCounter: (index: number) => Object.assign({}, new RemoveCounter(index)),
  reset: (index: number) => Object.assign({}, new Reset(index)),
};

export const listReducer = (state: number[] = [], action: CountersAction) => {
  switch (action.type) {
    case INCREMENT:
      return [
        ...state.slice(0, action.payload),
        state[action.payload] + 1,
        ...state.slice(action.payload + 1)
      ];
    case DECREMENT:
      return [
        ...state.slice(0, action.payload),
        state[action.payload] - 1,
        ...state.slice(action.payload + 1)
      ];
    case RESET:
      return [
        ...state.slice(0, action.payload),
        0,
        ...state.slice(action.payload + 1)
      ];
    case ADD_COUNTER:
      return [...state, 0];
    case REMOVE_COUNTER:
      return [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1)
      ];
    case COUNTERS_UPDATED:
      return [...action.payload];
    default:
      return state;
  }
}

export const loadedReducer = (state: boolean = false, action: CountersAction) => {
  switch (action.type) {
    case COUNTERS_LOADED:
      return true;
    default:
      return state;
  }
}

export const errorReducer = (state: string = '', action: CountersAction) => {
  switch (action.type) {
    case COUNTERS_ERROR:
      return action.payload.message;
    default:
      return state;
  }
}

export const reducers = {
  counters: combineReducers({
    error: errorReducer,
    list: listReducer,
    loaded: loadedReducer
  })
};
