import * as React from 'react';
import { connect } from 'react-redux';

import loading from '../../common/components/loading';
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

export const mapStateToProps = (state: IState) =>({
  counters: state.counters.list,
  error: state.counters.error,
  loaded: state.counters.loaded
});

export const mapDispatchToProps = {
  addCounter: actionCreators.addCounter,
  decrement: actionCreators.decrement,
  increment: actionCreators.increment,
  load: actionCreators.loadCounters,
  remove: actionCreators.removeCounter,
  reset: actionCreators.reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  loading(Counters)
);
