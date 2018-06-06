import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Layout from './Layout';
import Home from './Home';
import Mappings from "./Mappings";
import Login from "./Login";

import '../styles/Gifts.css';

class App extends Component {

  defaultState = {
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    }
  }

  state = this.defaultState;

  onLoginSuccess = (user, readonly) => {
    const { history } = this.props;

    this.setState({
      authenticated: true,
      readonly,
      user
    }, () => {
      history.push('/');
    });
  }

  onLoginFailure = () => {
    this.setState(this.defaultState);
  }

  render() {
    const { authenticated } = this.state;
    const LoginComponent = () => <Login
      onLoginSuccess={this.onLoginSuccess}
      onLoginFailure={this.onLoginFailure}
      />

    return (
      <Layout {...this.state}>
        <h3>{authenticated ?  'Welcome' : 'Not logged in yet!'}</h3>
        <Switch>
          <Route exact path={'/'} component={Home}/>
          <Route exact path={'/mappings'} component={Mappings}/>
          <Route exact path={'/login'} render={LoginComponent} />
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(App);