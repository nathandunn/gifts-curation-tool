import { Component } from 'react';
import PropTypes from 'prop-types';
import decode from 'jwt-decode';
import { withCookies } from 'react-cookie';
import '../styles/Home.css';

const GIFTS_DOMAIN = 'self.gifts';
const GIFTS_DOMAIN_ID = 'dom-5e831673-a930-49e3-a5a3-e9de307cd449';

class Login extends Component {
  componentDidMount() {
    window.addEventListener('message', this.onElixirResponse);
    this.windowRef = window
      .open(`https://explore.api.aai.ebi.ac.uk/sso?from=${AUTH_CALLBACK_URL}`, 'elixir')
      .focus();
  }

  onElixirResponse = (message) => {
    const { onLoginSuccess, cookies } = this.props;

    if (message.origin !== 'https://explore.api.aai.ebi.ac.uk') {
      return false;
    }

    const jwt = decode(message.data);
    cookies.set('jwt', message.data, { path: '/' });
    let readonly = true;
    const user = {
      id: jwt.sub,
      name: jwt.name,
    };

    for (let i = 0; i < jwt.domains.length; i++) {
      const domain = jwt.domains[i];

      if (domain === GIFTS_DOMAIN || domain === GIFTS_DOMAIN_ID) {
        readonly = false;
        onLoginSuccess(user, readonly);
        return true;
      }
    }

    // Default behaviour
    onLoginSuccess(user, readonly);
    return true;
  };

  render = () => null;
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  cookies: PropTypes.object.isRequired,
};

export default withCookies(Login);
