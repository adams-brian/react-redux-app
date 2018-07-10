import { connect } from 'react-redux';

import { Counters as UnwrappedCounters } from '../components/counters';
import { actionCreators, IAppState } from '../store';

export const Counters = connect(
  (state: IAppState) => 
    ({ counters: state.counters }),
  { 
    addCounter: actionCreators.addCounter,
    decrement: actionCreators.decrement,
    increment: actionCreators.increment,
    remove: actionCreators.removeCounter,
    reset: actionCreators.reset
  }
  )(UnwrappedCounters);
  