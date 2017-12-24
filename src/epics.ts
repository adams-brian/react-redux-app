import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/ignoreElements';
import { combineEpics, Epic } from 'redux-observable';
import { LOCATION_CHANGE, LocationChangeAction } from 'react-router-redux';

import { AppAction, AppState, actionCreators, INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER } from './store';

const loadCounters: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(LOCATION_CHANGE)
  .do((action: LocationChangeAction) => {
    if (action.payload.pathname.startsWith('/counters')) {
      store.dispatch(actionCreators.startLoading());
      fetch('http://localhost:3000/counters')
      .then((response) => response.json())
      .then((json) => {
        store.dispatch(actionCreators.countersUpdated(json.data));
        store.dispatch(actionCreators.doneLoading());
      })
      .catch((err) => {
        console.log('request for counters failed: ', err);
        store.dispatch(actionCreators.doneLoading());
      });
    }
  })
  .ignoreElements();

const saveCounters: Epic<AppAction, AppState> = (action$, store) => action$
  .ofType(INCREMENT, DECREMENT, RESET, ADD_COUNTER, REMOVE_COUNTER)
  .debounceTime(1000)
  .do((action: AppAction) => {
    fetch('http://localhost:3000/counters', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({counters: store.getState().counters})
    })
    .catch((err) => console.log('failed to update counters: ', err));
  })
  .ignoreElements();

export const epics = combineEpics(
  loadCounters,
  saveCounters
);
