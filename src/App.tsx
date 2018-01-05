import * as React from 'react';
import './App.css';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Nav } from './components/nav';
import { Counters } from './containers/counters';
import { Users } from './components/users';
import { Footer } from './components/footer';

import { AppState } from './store';

interface AppProps extends RouteComponentProps<{}> {
  loading: boolean;
}

export const App = withRouter(connect(
  (state: AppState) => ({ loading: state.loading })
)(
  (props: AppProps) => (
    <div className="App d-flex flex-column">
      <Nav/>
      <div className="content">
        {props.loading
        ?
          <div className="loading"/>
        :
          <div className="container">
            <Switch>
              <Redirect exact={true} from="/" to="/counters"/>
              <Route path="/counters" component={Counters}/>
              <Route path="/users" component={Users}/>
              <Route path="/about" render={() => <h1>About</h1>}/>
            </Switch>
          </div>
        }
      </div>
      <Footer/>
    </div>
  )
));
