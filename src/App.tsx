import * as React from 'react';
import './App.css';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Nav } from './components/nav';
import { Counters } from './containers/counters';
import { Footer } from './components/footer';

import { AppState } from './store';

interface AppProps extends RouteComponentProps<{}> {
  loading: boolean;
}

export const App = withRouter(connect(
  (state: AppState) => ({ loading: state.loading })
)(
  (props: AppProps) => (
    <div className="App">
      <Nav/>
      <div className="container">
        {props.loading
        ?
          <div className="loading"/>
        :
          <Switch>
            <Redirect exact={true} from="/" to="/counters"/>
            <Route path="/counters" component={Counters}/>
            <Route path="/users" render={() => <h1>Users</h1>}/>
            <Route path="/about" render={() => <h1>About</h1>}/>
          </Switch>
        }
      </div>
      <Footer/>
    </div>
  )
));
