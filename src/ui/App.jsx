import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import queryString from 'query-string';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Login from './Login';
import Logout from './Logout';
import Mapping from './Mapping';
import Message from './components/Message';

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
    searchTerm: queryString.parse(this.props.location.search).searchTerm
      ? queryString.parse(this.props.location.search).searchTerm
      : '',
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    },
    message: {
      title: 'Oops!',
      text: 'something went wrong',
      isError: false,
    },
  };

  handleSearchSubmit = (e, input) => {
    const { history } = this.props;
    this.setState({ searchTerm: input });
    history.push(`/mappings?searchTerm=${input}`);
    e.preventDefault();
  };

  exploreMappingsAction = () => {
    const { history } = this.props;
    this.setState({ searchTerm: '' });
    history.push('/mappings');
  };

  setMessage = (title, message, isError) => {
    this.setState({
      message: {
        title,
        message,
        isError,
      },
    });
  };

  clearMessage = () => {
    this.setState({
      message: null,
    });
  };

  render() {
    const { authenticated, message } = this.state;
    const LoginComponent = () => (
      <Login onLoginSuccess={this.onLoginSuccess} onLoginFailure={this.onLoginFailure} />
    );

    const LogoutComponent = () => <Logout onLogout={this.onLogout} />;
    const appProps = {
      ...this.state,
      handleSearchSubmit: this.handleSearchSubmit,
      exploreMappingsAction: this.exploreMappingsAction,
    };

    return (
      <Layout {...appProps}>
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            {message !== null ? <Message details={message} onClose={this.clearMessage} /> : null}
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/mappings" render={() => <Mappings {...appProps} />} />
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
