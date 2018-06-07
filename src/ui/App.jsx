import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import Layout from './Layout';
import Home from './Home';
import Mappings from "./Mappings";
import Login from "./Login";
import Logout from "./Logout";

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

  componentWillMount() {
        const { cookies } = this.props;

      this.setState({
            authenticated: cookies.get('authenticated') === '1' ? true : false,
            jwt: cookies.get('jwt') || ""
        });
  }

  onLoginSuccess = (user, readonly) => {
    const { history, cookies } = this.props;

    this.setState({
      authenticated: true,
      readonly,
      user
    }, () => {
      history.push('/');
      cookies.set('authenticated', '1', { path: '/' });
    });

  }

  onLoginFailure = () => {
    this.setState(this.defaultState);
  }

  onLogout = () => {
    const { history } = this.props;

    this.setState(this.defaultState);
    history.push('/');
  }

  render() {
    const { authenticated } = this.state;
    const LoginComponent = () => <Login
      onLoginSuccess={this.onLoginSuccess}
      onLoginFailure={this.onLoginFailure}
      />

     const LogoutComponent = () => <Logout
          onLogout={this.onLogout}
     />

    return (
      <Layout {...this.state}>
        <h3>{authenticated ?  'Welcome' : 'Not logged in yet!'}</h3>
        <Switch>
          <Route exact path={'/'} component={Home}/>
          <Route exact path={'/mappings'} component={Mappings}/>
          <Route exact path={'/login'} render={LoginComponent} />
          <Route exact path={'/logout'} render={LogoutComponent} />
        </Switch>
      </Layout>
    );
  }
}

export default withRouter(withCookies(App));