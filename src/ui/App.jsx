import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import queryString from 'query-string';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Unmapped from './Unmapped';
import Login from './Login';
import Logout from './Logout';
import Mapping from './Mapping';
import Broken from './Broken';
import Message from './components/Message';
import NoResults from './NoResults';
import Feedback from './Feedback';

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

  onLoginSuccess = (user, readonly) => {
    const { history, cookies } = this.props;

    this.setState(
      {
        authenticated: true,
        validToken: true,
        readonly,
        user,
      },
      () => {
        history.push(`${BASE_URL}/`);
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
    history.push(`${BASE_URL}/`);
  };

  setMessage = (title, text, isError) => {
    this.setState({
      message: {
        title,
        text,
        isError,
      },
    });
  };

  exploreMappingsAction = () => {
    const { history } = this.props;
    this.setState({ searchTerm: '' });
    history.push(`${BASE_URL}/mappings`);
  };

  handleSearchSubmit = (e, input) => {
    const { history } = this.props;

    this.setState({
      searchTerm: input,
      offset: 0,
      limit: 15,
      initialPage: 0,
      activeFacets: {},
    });

    history.push(`${BASE_URL}/mappings?searchTerm=${input}`);
    e.preventDefault();
  };

  clearSearchTerm = callback => this.setState({ searchTerm: '' }, callback);

  defaultState = {
    searchTerm: queryString.parse(this.props.location.search).searchTerm
      ? queryString.parse(this.props.location.search).searchTerm
      : '',
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    },
    message: null,
    validToken: null,
    offset: 0,
    limit: 15,
    activeFacets: {},
    initialPage: 0,
  };

  clearMessage = () => this.setState({ message: null });

  tokenIsExpired = () => {
    this.setState({
      validToken: false,
      authenticated: false,
      readonly: true,
      user: {
        id: 'guest',
        name: 'Guest',
      },
    });
  };

  clearExpiredLoginMessage = () => {
    const { cookies } = this.props;

    this.setState({
      validToken: true,
    });

    cookies.remove('jwt', { path: '/' });
  };

  exploreMappingsByOrganism = (organism) => {
    const activeFacetsCopy = {
      activeFacets: {},
      organism,
      offset: 0,
      limit: 15,
      initialPage: 0,
      searchTerm: '',
    };

    this.setState({
      activeFacets: activeFacetsCopy,
    }, () => {
      this.exploreMappingsAction();
    });
  };

  removeFilter = (facet) => {
    const { activeFacets } = this.state;
    const activeFacetsCopy = {
      ...activeFacets,
    };

    delete activeFacetsCopy[facet];

    this.setState({
      activeFacets: activeFacetsCopy,
    });
  };

  addFilter = (facet, value) => {
    const { activeFacets } = this.state;
    const activeFacetsCopy = {
      ...activeFacets,
    };

    activeFacetsCopy[facet] = value;

    this.setState({
      activeFacets: activeFacetsCopy,
    });
  };

  setResults = (data) => {
    this.setState({
      params: data.params,
      facets: data.facets,
      results: data.results,
      totalCount: data.totalCount,
      displayIsoforms: data.displayIsoforms,
    });
  }

  changePageParams = (params) => {
    const { offset, initialPage } = params;
    if (offset === this.state.offset && initialPage === this.state.initialPage) {
      return;
    }
    this.setState({
      offset: params.offset,
      initialPage: params.initialPage,
    });
  }

  resetSearchAndFacets = (callback) => {
    this.setState({
      searchTerm: '',
      offset: 0,
      limit: 15,
      activeFacets: {},
      initialPage: 0,
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  goToMappingsPage = (e) => {
    const { history } = this.props;

    const callback = () => history.push(`${BASE_URL}/mappings`);
    this.resetSearchAndFacets(callback);
    e.preventDefault();
  }

  render() {
    const {
      authenticated, message, validToken, exploreMappingsByOrganism,
    } = this.state;
    const LoginComponent = () => (
      <Login onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
    );

    const LogoutComponent = () => <Logout onLogout={this.onLogout} />;
    const appProps = {
      ...this.state,
      handleSearchSubmit: this.handleSearchSubmit,
      tokenIsExpired: this.tokenIsExpired,
      setMessage: this.setMessage,
      clearSearchTerm: this.clearSearchTerm,
      exploreMappingsByOrganism: this.exploreMappingsByOrganism,
      getFacetsAsString: this.getFacetsAsString,
      removeFilter: this.removeFilter,
      addFilter: this.addFilter,
      setResults: this.setResults,
      changePageParams: this.changePageParams,
      resetSearchAndFacets: this.resetSearchAndFacets,
      goToMappingsPage: this.goToMappingsPage,
    };

    const tokenIsExpiredMessage = {
      isError: true,
      title: 'Your login token is expired',
      text: <Link to={`${BASE_URL}/login`}>Click here to login again.</Link>,
    };
    return (
      <Layout {...appProps}>
        <section id="main-content-area" role="main">
          <div id="root">
            {message !== null ? <Message details={message} onClose={this.clearMessage} /> : null}
            {validToken === false ? (
              <Message details={tokenIsExpiredMessage} onClose={this.clearExpiredLoginMessage} />
            ) : null}
            <Switch>
              <Route exact path={`${BASE_URL}/`} render={() => <Home {...appProps} />} />
              <Route
                exact
                path={`${BASE_URL}/mappings`}
                render={() => (
                  <Mappings {...appProps} defaultOrganism={exploreMappingsByOrganism} />
                )}
              />
              <Route
                exact
                path={`${BASE_URL}/unmapped`}
                render={() => <Unmapped {...appProps} />}
              />
              <Route exact path={`${BASE_URL}/login`} component={LoginComponent} />
              <Route exact path={`${BASE_URL}/logout`} component={LogoutComponent} />
              <Route
                path={`${BASE_URL}/mapping/:mappingId`}
                render={({ match }) => (
                  <Mapping match={match} isLoggedIn={authenticated} {...appProps} />
                )}
              />
              <Route exact path={`${BASE_URL}/error`} render={() => <Broken {...appProps} />} />
              <Route exact path={`${BASE_URL}/feedback`} component={Feedback} />
              <Route exact path={`${BASE_URL}/no-results`} render={() => <NoResults {...appProps} />} />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

App.propTypes = {
  cookies: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(withCookies(App));
