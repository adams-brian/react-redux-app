import * as React from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Nav } from './components/nav';
import { Counters } from './containers/counters';
import { Footer } from './components/footer';

export const App = () => (
  <div className="App">
    <Nav/>
    <div className="container">
      <Switch>
        <Redirect exact={true} from="/" to="/counters"/>
        <Route path="/counters" component={Counters}/>
        <Route path="/users" render={() => <h1>Users</h1>}/>
        <Route path="/about" render={() => <h1>About</h1>}/>
      </Switch>
    </div>
    <Footer/>
  </div>
);
