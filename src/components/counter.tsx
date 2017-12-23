import * as React from 'react';

interface CounterProps {
  counter: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  remove: () => void;
}

export const Counter = (props: CounterProps) => (
  <div className="counter">
    <button type="button" className="close" aria-label="Close" onClick={props.remove}>
      <span aria-hidden="true">&times;</span>
    </button>
    <div><h1>{props.counter}</h1></div>
    <div>
      <button onClick={props.increment}><span className="fa fa-plus"/></button>
      <button onClick={props.decrement}><span className="fa fa-minus"/></button>
      <button onClick={props.reset}><span className="fa fa-refresh"/></button>
    </div>
  </div>
);
