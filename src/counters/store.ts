import { IAction } from '../store';

export interface IState {
  counters: number[];
}

/* tslint:disable:max-classes-per-file */
abstract class ActionWithNumberPayload implements IAction {
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
class AddCounter implements IAction {
  public readonly type = ADD_COUNTER;
}
export const REMOVE_COUNTER = '[Counters] REMOVE COUNTER';
class RemoveCounter extends ActionWithNumberPayload {
  public readonly type = REMOVE_COUNTER;
}
export const COUNTERS_UPDATED = '[Counters] COUNTERS UPDATED';
class CountersUpdated implements IAction {
  public readonly type = COUNTERS_UPDATED;
  constructor(public payload: number[]) {}
}
export type CountersAction = Increment | Decrement | Reset | AddCounter | RemoveCounter | CountersUpdated;

export const actionCreators = {
  addCounter: () => Object.assign({}, new AddCounter()),
  countersUpdated: (counters: number[]) => Object.assign({}, new CountersUpdated(counters)),
  decrement: (index: number) => Object.assign({}, new Decrement(index)),
  increment: (index: number) => Object.assign({}, new Increment(index)),
  removeCounter: (index: number) => Object.assign({}, new RemoveCounter(index)),
  reset: (index: number) => Object.assign({}, new Reset(index)),
};

function countersReducer(state: number[] = [], action: CountersAction) {
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

export const reducers = {
  counters: countersReducer
}
