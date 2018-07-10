import * as React from 'react';
import { connect } from 'react-redux';

import { actionCreators, IState } from '../store';
import Counter from './counter';

interface ICountersProps {
  counters: number[];
  addCounter: () => void;
  increment: (index: number) => void;
  decrement: (index: number) => void;
  reset: (index: number) => void;
  remove: (index: number) => void;
}

export const Counters = (props: ICountersProps) => (
  <div className="counters-container">
    <h1>Counters</h1>
    <h3>Count: {props.counters.length}</h3>
    <div className="counter-container">
      {props.counters.map((counter, index) => 
        (<Counter 
          key={index} /* not ideal, but it works in this case */
          index={index}
          counter={counter}
          increment={props.increment}
          decrement={props.decrement}
          reset={props.reset}
          remove={props.remove}
        />))}
      <div className="add-counter rounded" onClick={props.addCounter}>
        <span className="fa fa-plus" />
      </div>
    </div>
  </div>
);

export default connect(
  (state: IState) => 
    ({ counters: state.counters }),
  { 
    addCounter: actionCreators.addCounter,
    decrement: actionCreators.decrement,
    increment: actionCreators.increment,
    remove: actionCreators.removeCounter,
    reset: actionCreators.reset
  }
)(Counters);
  
