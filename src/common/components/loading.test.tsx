import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';

import loading from './loading';

const SimpleComponent = (props: { message: string }) =>
  <div>{props.message}</div>

const Wrapper = loading(SimpleComponent);

describe("loading", () => {

  let clock: sinon.SinonFakeTimers;
  let load: sinon.SinonSpy;

  const getElement = (loaded: boolean) => 
    <Wrapper
      error=""
      loaded={loaded}
      load={load}
      message="message from props"
    />;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    load = sinon.spy();  
  });

  afterEach(() => {
    clock.restore();
  });

  it('renders as expected', () => {
    const component = mount(getElement(false));
    expect(component).toMatchSnapshot();
  });

  it('should render the component if loaded', () => {
    const component = mount(getElement(true));
    expect(component.html()).toMatchSnapshot();
    clock.tick(500);
    expect(component.html()).toMatchSnapshot();
    clock.tick(5000);
    expect(component.html()).toMatchSnapshot();
    expect(load.called).toBe(false);
  });

  it('should render null until loaded for load times < 500ms', () => {
    const component = mount(getElement(false));
    expect(load.calledOnce).toBe(true);
    setTimeout(() => { component.setProps( { loaded: true }); }, 500);
    expect(component.html()).toMatchSnapshot();
    clock.tick(500);
    expect(component.html()).toMatchSnapshot();
    clock.tick(5000);
    expect(component.html()).toMatchSnapshot();
  });

  it('should render null for 500ms, then loading until loaded for load times > 500ms', () => {
    const component = mount(getElement(false));
    expect(load.calledOnce).toBe(true);
    setTimeout(() => { component.setProps( { loaded: true }); }, 2000);
    expect(component.html()).toMatchSnapshot();
    clock.tick(500);
    expect(component.html()).toMatchSnapshot();
    clock.tick(1500);
    expect(component.html()).toMatchSnapshot();
  });

  it('should render the error message', () => {
    const component = mount(getElement(false));
    expect(load.calledOnce).toBe(true);
    setTimeout(() => { component.setProps( { error: 'error message' }); }, 2000);
    expect(component.html()).toMatchSnapshot();
    clock.tick(500);
    expect(component.html()).toMatchSnapshot();
    clock.tick(1500);
    expect(component.html()).toMatchSnapshot();
  });

  it('should clear the timeout on unmount', () => {
    const component = mount(getElement(false));
    expect(component.html()).toMatchSnapshot();
    component.unmount();
    clock.tick(5000);
    expect(component.html()).toMatchSnapshot();
  });

});
