import { shallow } from 'enzyme';
import { createLocation, createMemoryHistory } from 'history'
import * as React from 'react';

import { App, mapStateToProps } from './App';
import About from './common/components/about';
import Counters from './counters/components/counters';
import Users from './users/components/users';

describe("App", () => {

  let element: JSX.Element;

  beforeEach(() => {
    element = (
      <App
        history={createMemoryHistory()}
        location={createLocation('/a/location')}
        match={{
          isExact: true,
          params: {},
          path: '/a/location',
          url: 'urlbase/a/location'
        }}
        loading={false}
      />
    )
  });

  it('renders as expected', () => {
    const component = shallow(element);
    expect(component).toMatchSnapshot();
  });

  it('shows loading', () => {
    const component = shallow(
      <App
        history={createMemoryHistory()}
        location={createLocation('/a/location')}
        match={{
          isExact: true,
          params: {},
          path: '/a/location',
          url: 'urlbase/a/location'
        }}
        loading={true}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('routes /counters to Counters', () => {
    const component = shallow(element);
    expect(component.find('Route[path="/counters"]').first().prop('component')).toBe(Counters);
  });

  it('routes /users to Users', () => {
    const component = shallow(element);
    expect(component.find('Route[path="/users"]').first().prop('component')).toBe(Users);
  });

  it('routes /about to About', () => {
    const component = shallow(element);
    expect(component.find('Route[path="/about"]').first().prop('component')).toBe(About);
  });

  it('should map the state to the props', () => {
    expect(mapStateToProps({ loading: false })).toEqual({ loading: false });
    expect(mapStateToProps({ loading: true })).toEqual({ loading: true });
  });
  
});
