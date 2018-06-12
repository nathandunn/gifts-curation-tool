import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import axios from 'axios';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Login from './Login';
import Logout from './Logout';

import '../styles/Gifts.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.handleSearch = this.handleSearch.bind(this);
    this.addFilter = this.addFilter.bind(this);
  }

  componentWillMount() {
    const { cookies } = this.props;

    this.setState({
      authenticated: cookies.get('authenticated') === '1',
      jwt: cookies.get('jwt') || '',
    });
  }

  onLoginSuccess = (user, readonly) => {
    const { history, cookies } = this.props;

    this.setState(
      {
        authenticated: true,
        readonly,
        user,
      },
      () => {
        history.push('/');
        cookies.set('authenticated', '1', { path: '/' });
      },
    );
  };

  onLoginFailure = () => {
    this.setState(this.defaultState);
  };

  onLogout = () => {
    const { history } = this.props;

    this.setState(this.defaultState);
    history.push('/');
  };

  defaultState = {
    searchTerm: null,
    filters: {},
    searchResults: null,
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    },
  };

  getResults = () => {};

  updateSearchTerm = (term) => {
    this.setState({ searchTerm: term, filters: {} }, () => this.handleSearch());
  };

  handleSearch = () => {
    axios
      .get('http://localhost:3000/gifts/mappings', {
        params: {
          searchTerm: this.state.searchTerm,
          ...this.state.filters,
        },
      })
      .then((response) => {
        this.setState({
          searchResults: response.data,
        });
        this.props.history.push('mappings');
      });
  };

  addFilter = (facet, value) => {
    const { filters } = this.state;
    filters[facet] = value;
    this.setState({ filters }, () => this.handleSearch());
  };

  render() {
    const { authenticated } = this.state;
    const LoginComponent = () => (
      <Login onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
    );

    const LogoutComponent = () => <Logout onLogout={this.onLogout} />;

    const appProps = {
      ...this.state,
      updateSearchTerm: this.updateSearchTerm,
      addFilter: this.addFilter,
    };

    return (
      <Layout {...appProps}>
        <h3>{authenticated ? 'Welcome' : 'Not logged in yet!'}</h3>
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/mappings" render={() => <Mappings {...appProps} />} />
              <Route exact path="/login" render={LoginComponent} />
              <Route exact path="/logout" render={LogoutComponent} />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

export default withRouter(withCookies(App));
