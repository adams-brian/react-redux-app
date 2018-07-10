export interface IState {
  loading: boolean;
}

export interface IAction {
  type: string;
}

/* tslint:disable:max-classes-per-file */
export const START_LOADING = '[App] START LOADING';
class StartLoading implements IAction {
  public readonly type = START_LOADING;
}
export const DONE_LOADING = '[App] DONE LOADING';
class DoneLoading implements IAction {
  public readonly type = DONE_LOADING;
}
export type LoadingAction = StartLoading | DoneLoading;

export const actionCreators = {
  doneLoading: () => Object.assign({}, new DoneLoading()),
  startLoading: () => Object.assign({}, new StartLoading()),
};

function loadingReducer(state: boolean = false, action: LoadingAction) {
  switch (action.type) {
    case START_LOADING:
      return true;
    case DONE_LOADING:
      return false;
    default:
      return state;
  }
}

export const reducers = {
  loading: loadingReducer
};
