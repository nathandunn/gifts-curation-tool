import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withCookies } from 'react-cookie';
import queryString from 'query-string';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
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
    history.push('/mappings');
  };

  handleSearchSubmit = (e, input) => {
    const { history } = this.props;
    this.setState({ searchTerm: input });
    history.push(`/mappings?searchTerm=${input}`);
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
  };

  clearMessage = () => this.setState({ message: null });

  tokenIsExpired = () => {
    console.log("app.tokenIsExpired called.");
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
      validToken: true
    });

    cookies.remove('jwt', { path: '/' });
  }

  render() {
console.log("app state:", this.state);
    const { authenticated, message, validToken } = this.state;
    const LoginComponent = () => (
      <Login onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
    );

    const LogoutComponent = () => <Logout onLogout={this.onLogout} />;
    const appProps = {
      ...this.state,
      handleSearchSubmit: this.handleSearchSubmit,
      exploreMappingsAction: this.exploreMappingsAction,
      tokenIsExpired: this.tokenIsExpired,
      setMessage: this.setMessage,
      clearSearchTerm: this.clearSearchTerm,
    };

    const tokenIsExpiredMessage = {
      isError: true,
      title: 'Your login token is expired',
      text: <Link to='/login'>Click here to login again.</Link>,
    };

    return (
      <Layout {...appProps}>
        <section id="main-content-area" role="main">
          <div id="root">
            {(message !== null) ? <Message details={message} onClose={this.clearMessage} /> : null}
            {(validToken === false) ? <Message details={tokenIsExpiredMessage} onClose={this.clearExpiredLoginMessage} /> : null}
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/no-results" component={NoResults} />
              <Route exact path="/mappings" render={() => <Mappings {...appProps} />} />
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/logout" component={LogoutComponent} />
              <Route
                path="/mapping/:mappingId"
                render={({ match }) => <Mapping match={match} isLoggedIn={authenticated} {...appProps} />}
              />
              <Route exact path="/error" render={() => <Broken {...appProps} />} />
              <Route exact path="/feedback" component={Feedback} />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

App.propTypes = {
  cookies: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
};

App.defaultProps = {
  cookies: {},
  history: {},
  location: {},
};

export default withRouter(withCookies(App));
