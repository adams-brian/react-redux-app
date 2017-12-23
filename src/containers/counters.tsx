import { connect } from 'react-redux';
import { AppState, actionCreators } from '../store';

import { Counters as UnwrappedCounters } from '../components/counters';

export const Counters = connect(
  (state: AppState) => 
    ({ counters: state.counters }),
  { 
    addCounter: actionCreators.addCounter,
    increment: actionCreators.increment,
    decrement: actionCreators.decrement,
    reset: actionCreators.reset,
    remove: actionCreators.removeCounter
  }
  )(UnwrappedCounters);
  