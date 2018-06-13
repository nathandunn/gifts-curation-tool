import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Login from './Login';
import Logout from './Logout';
import Header from './components/Header';

import '../styles/Gifts.css';

class App extends Component {

  defaultState = {
    searchTerm: null,
    searchResults: null,
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    }
  }

  state = this.defaultState;

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillMount() {
    const { cookies } = this.props;

    this.setState({
      authenticated: cookies.get('authenticated') === '1' ? true : false,
      jwt: cookies.get('jwt') || ""
    });
  }

  handleSearch = term => {
    const accession = term;
    const apiURI = `http://localhost:3000/search?term=${accession}`;
    axios.get(apiURI)
      .then(response => {
        console.log("handleSearch response:", response);
        this.setState({
          searchTerm: term,
          searchResults: response.data,
        });
        this.props.history.push('mappings');
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

    const appProps = {
      ...this.state,
      handleSearch: this.handleSearch,
    };

    return (
      <Layout {...appProps}>
        <h3>{authenticated ?  'Welcome' : 'Not logged in yet!'}</h3>
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/mappings" render={() => <Mappings {...appProps} />} />
              <Route exact path={'/login'} render={LoginComponent} />
              <Route exact path={'/logout'} render={LogoutComponent} />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

export default withRouter(withCookies(App));
