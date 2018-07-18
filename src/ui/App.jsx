import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import axios from 'axios';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Login from './Login';
import Logout from './Logout';
import Mapping from './Mapping';
import Header from './components/Header';

import '../styles/Gifts.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  componentWillMount() {
    const { cookies } = this.props;

    this.setState({
      authenticated: cookies.get('authenticated') === '1',
      jwt: cookies.get('jwt') || '',
    });
  }

  componentDidMount = () => {
    const urlParams = this.parseURLParams();
  };

  parseURLParams = () => {
    const { searchTerm, filters } = this.state;
    const url = window.location.pathname;
    const regexSearchAndFilters = /^\/mappings\/([a-zA-Z0-9\-_]+)\/?(.+)?\/?$/;
    const params = url.match(regexSearchAndFilters);

    if (params === null) {
      return false;
    }

    const [full, searchTermParam, filtersParam] = params;

    if (searchTerm === '' || searchTerm === null) {
      this.setState({
        searchTerm: searchTermParam,
      });
    }
  };

  displaySearchResults = () => {
    const { searchTerm } = this.state;
    const { history } = this.props;

    history.push(`/mappings/${searchTerm}`);
  };

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
    searchTerm: '',
    filters: {},
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    },
  };

  getResults = () => {};

  handleSearchTermChange = ({ target }) => {
    this.setState({
      searchTerm: target.value,
    });
  };

  handleSearchSubmit = () => {
    this.displaySearchResults();
  };

  addFilter = (facet, value) => {
    const { filters } = this.state;
    filters[facet] = value;
    this.setState(
      {
        filters,
      },
      this.forceUpdate,
    );
  };

  removeFilter = (facet) => {
    const { filters } = this.state;
    delete filters[facet];
    this.setState(
      {
        filters,
      },
      this.forceUpdate,
    );
  };

  render() {
    const { authenticated } = this.state;
    const LoginComponent = () => (
      <Login onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
    );

    const LogoutComponent = () => <Logout onLogout={this.onLogout} />;

    const appProps = {
      ...this.state,
      addFilter: this.addFilter,
      removeFilter: this.removeFilter,
      handleSearchTermChange: this.handleSearchTermChange,
      handleSearchSubmit: this.handleSearchSubmit,
    };

    return (
      <Layout {...appProps}>
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/mappings" render={() => <Mappings {...appProps} />} />
              <Route exact path="/mappings/:term" render={() => <Mappings {...appProps} />} />
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/logout" component={LogoutComponent} />
              <Route
                path="/mapping/:mappingId"
                render={({ match }) => <Mapping match={match} isLoggedIn={authenticated} />}
              />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

export default withRouter(withCookies(App));
