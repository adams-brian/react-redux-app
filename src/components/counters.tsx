import * as React from 'react';
import { Counter } from './counter';

interface ICountersProps {
  counters: number[];
  addCounter: () => void;
  increment: (index: number) => void;
  decrement: (index: number) => void;
  reset: (index: number) => void;
  remove: (index: number) => void;
}

/* tslint:disable:jsx-no-lambda */
export const Counters = (props: ICountersProps) => (
  <div className="counters-container">
    <h1>Counters</h1>
    <div className="counter-container">
      {props.counters.map((counter, index) => 
        (<Counter 
          key={index} /* not ideal, but it works in this case */
          counter={counter}
          increment={() => props.increment(index)}
          decrement={() => props.decrement(index)}
          reset={() => props.reset(index)}
          remove={() => props.remove(index)}
        />))}
      <div className="add-counter rounded" onClick={props.addCounter}>
        <span className="fa fa-plus" />
      </div>
    </div>
  </div>
);
