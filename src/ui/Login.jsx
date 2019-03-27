import { Component } from 'react';
import PropTypes from 'prop-types';
import decode from 'jwt-decode';
import { withCookies } from 'react-cookie';
import '../styles/Home.scss';

const GIFTS_DOMAIN = 'self.gifts';
const GIFTS_DOMAIN_ID = 'dom-23a4a571-5193-4cdd-838b-097ee9440e12';
const AAP_ENDPOINT_BASE = 'https://api.aai.ebi.ac.uk';

class Login extends Component {
  componentDidMount() {
    window.addEventListener('message', this.onElixirResponse);
    this.windowRef = window
      .open(`${AAP_ENDPOINT_BASE}/sso?from=${AUTH_CALLBACK_URL}`, 'elixir')
      .focus();
  }

  onElixirResponse = (message) => {
    const { onLoginSuccess, cookies } = this.props;

    if (message.origin !== AAP_ENDPOINT_BASE) {
      return false;
    }

    const jwt = decode(message.data);
    cookies.set('jwt', message.data, { path: '/' });
    let readonly = true;
    const user = {
      id: jwt.sub,
      name: jwt.name,
    };

    for (let i = 0; i < jwt.domains.length; i += 1) {
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
  cookies: PropTypes.shape({}).isRequired,
};

export default withCookies(Login);
