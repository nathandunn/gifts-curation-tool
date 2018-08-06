import React, { Component } from 'react';

import { withCookies, Cookies } from 'react-cookie';

import '../styles/Home.css';

class Logout extends Component {
  constructor(props) {
    super(props);
    const { onLogout, cookies } = props;

    cookies.remove('authenticated', { path: '/' });
    cookies.remove('jwt', { path: '/' });
    onLogout();
  }

    render = () => null;
}

export default withCookies(Logout);
