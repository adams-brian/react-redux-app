import { combineReducers, createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

export interface AppState {
  loading: boolean;
  counters: number[];
}

interface Action {
  type: string;
}

const START_LOADING = '[App] START LOADING';
class StartLoading implements Action {
  readonly type = START_LOADING;
}
const DONE_LOADING = '[App] DONE LOADING';
class DoneLoading implements Action {
  readonly type = DONE_LOADING;
}
type AppAction = StartLoading | DoneLoading;

abstract class ActionWithNumberPayload implements Action {
  readonly type: string;
  constructor(public payload: number) {}
}
const INCREMENT = '[Counters] INCREMENT';
class Increment extends ActionWithNumberPayload {
  readonly type = INCREMENT;
}
const DECREMENT = '[Counters] DECREMENT';
class Decrement extends ActionWithNumberPayload {
  readonly type = DECREMENT;
}
const RESET = '[Counters] RESET';
class Reset extends ActionWithNumberPayload {
  readonly type = RESET;
}
const ADD_COUNTER = '[Counters] ADD COUNTER';
class AddCounter implements Action {
  readonly type = ADD_COUNTER;
}
const REMOVE_COUNTER = '[Counters] REMOVE COUNTER';
class RemoveCounter extends ActionWithNumberPayload {
  readonly type = REMOVE_COUNTER;
}
const COUNTERS_UPDATED = '[Counters] COUNTERS UPDATED';
class CountersUpdated implements Action {
  readonly type = COUNTERS_UPDATED;
  constructor(public payload: number[]) {}
}
type CounterAction = Increment | Decrement | Reset | AddCounter | RemoveCounter | CountersUpdated;

export const actionCreators = {
  startLoading: () => Object.assign({}, new StartLoading()),
  doneLoading: () => Object.assign({}, new DoneLoading()),

  increment: (index: number) => Object.assign({}, new Increment(index)),
  decrement: (index: number) => Object.assign({}, new Decrement(index)),
  reset: (index: number) => Object.assign({}, new Reset(index)),
  addCounter: () => Object.assign({}, new AddCounter()),
  removeCounter: (index: number) => Object.assign({}, new RemoveCounter(index)),
  countersUpdated: (counters: number[]) => Object.assign({}, new CountersUpdated(counters))
};

function loadingReducer(state: boolean = false, action: AppAction) {
  switch (action.type) {
    case START_LOADING:
      return true;
    case DONE_LOADING:
      return false;
    default:
      return state;
  }
}

function countersReducer(state: number[] = [], action: CounterAction) {
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

const rootReducer = combineReducers({ 
  loading: loadingReducer,
  counters: countersReducer
});

export const store = createStore(
  rootReducer,
  devToolsEnhancer({})
);