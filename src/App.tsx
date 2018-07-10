import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import './App.css';
import { Footer } from './components/footer';
import { Nav } from './components/nav';
import { Users } from './components/users';
import { Counters } from './containers/counters';
import { IAppState } from './store';

interface IAppProps extends RouteComponentProps<{}> {
  loading: boolean;
}

/* tslint:disable:jsx-no-lambda */
export const App = withRouter(connect(
  (state: IAppState) => ({ loading: state.loading })
)(
  (props: IAppProps) => (
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
