import { Component } from 'react';
import PropTypes from 'prop-types';

import { withCookies } from 'react-cookie';

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

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
};

export default withCookies(Logout);
