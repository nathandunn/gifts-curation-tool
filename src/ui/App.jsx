import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import Layout from './Layout';
import Home from './Home';
import Mappings from './Mappings';
import Login from './Login';
import Logout from './Logout';
import Mapping from './Mapping';
import Broken from './Broken';
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
    filters: {},
    searchTerm: '',
    authenticated: false,
    readonly: true,
    user: {
      id: 'guest',
      name: 'Guest',
    },
    message: null
  };

  handleSearchSubmit = (e, input) => {
    const { history } = this.props;

    this.setState({
      searchTerm: input,
    });
    history.push(`/mappings/${input}`);
    e.preventDefault();
  };

  exploreMappingsAction = () => {
    const { history } = this.props;
    this.setState({ searchTerm: '' });
    history.push('/mappings/all');
  };

  setMessage = (title, message, isError) => {
    this.setState({
      message: {
        title,
        message,
        isError
      }
    });
  };

  clearMessage = () => {
    this.setState({
      message: null
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
            {(null !== message) ? <Message details={message} onClose={this.clearMessage} /> : null}
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/mappings/:term" render={() => <Mappings {...appProps} />} />
              <Route exact path="/login" component={LoginComponent} />
              <Route exact path="/logout" component={LogoutComponent} />
              <Route
                path="/mapping/:mappingId"
                render={({ match }) => <Mapping match={match} isLoggedIn={authenticated} />}
              />
              <Route exact path="/error" render={() => <Broken {...appProps} />} />
            </Switch>
          </div>
        </section>
      </Layout>
    );
  }
}

export default withRouter(withCookies(App));
