import React, { Component } from 'react';

import decode from 'jwt-decode';
import { withCookies, Cookies } from 'react-cookie';

const GIFTS_DOMAIN = "self.gifts";
const GIFTS_DOMAIN_ID = "dom-5e831673-a930-49e3-a5a3-e9de307cd449";

import '../styles/Home.css';

class Login extends Component {
    windowRef = null;

    componentDidMount() {
      window.addEventListener("message", this.onElixirResponse);
      this.windowRef = window
        .open('https://explore.api.aai.ebi.ac.uk/sso?from=http%3A%2F%2Flocalhost%3A39093%2Flogin', 'elixir')
        .focus();
    }

    onElixirResponse = message => {
      const { onLoginSuccess, onLoginFailure, cookies } = this.props;

      if ('https://explore.api.aai.ebi.ac.uk' !== message.origin) {
          return false;
      }

      const jwt = decode(message.data);
      cookies.set('jwt', message.data, { path: '/' });
      let readonly = true;
      const user = {
        id: jwt.sub,
        name: jwt.name,
      };

      for (let i =0; i < jwt.domains.length; i++) {
        const domain = jwt.domains[i];

        if (domain === GIFTS_DOMAIN || domain === GIFTS_DOMAIN_ID) {

          readonly = false;
          onLoginSuccess(user, readonly);
          return;
        }
      }

      // Default behaviour 
      onLoginSuccess(user, readonly);
    }

    render = () => null;
}

export default withCookies(Login);
