import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import About from './common/components/about';
import Footer from './common/components/footer';
import Nav from './common/components/nav';
import Counters from './counters/components/counters';
import Users from './users/components/users';

export const App = () => (
  <div className="App d-flex flex-column">
    <Nav/>
    <div className="content">
      <div className="container">
        <Switch>
          <Redirect exact={true} from="/" to="/counters"/>
          <Route path="/counters" component={Counters}/>
          <Route path="/users" component={Users}/>
          <Route path="/about" component={About}/>
        </Switch>
      </div>
    </div>
    <Footer/>
  </div>
);

export default App;
