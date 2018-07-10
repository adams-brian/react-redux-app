import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import './App.css';
import About from './common/components/about';
import Footer from './common/components/footer';
import Nav from './common/components/nav';
import Counters from './counters/components/counters';
import Users from './users/components/users';

import { IState } from './store';

interface IAppProps extends RouteComponentProps<{}> {
  loading: boolean;
}

export const App = (props: IAppProps) => (
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
            <Route path="/about" component={About}/>
          </Switch>
        </div>
      }
    </div>
    <Footer/>
  </div>
);

export default withRouter(
  connect(
    (state: IState) => ({ loading: state.loading })
  )( App )
);
