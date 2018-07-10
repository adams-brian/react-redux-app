import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import './App.css';
import Footer from './common/components/footer';
import Nav from './common/components/nav';
import Counters from './counters/components/counters';
import Users from './users/components/users';

import { IAppState } from './store';

interface IAppProps extends RouteComponentProps<{}> {
  loading: boolean;
}

/* tslint:disable:jsx-no-lambda */
const App = withRouter(connect(
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

export default App;
