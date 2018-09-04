import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import SearchField from './SearchField';

function Header(props) {
  const { authenticated, user } = props;

  return (
    <div data-sticky-container>
      <header
        id="masthead"
        className="masthead"
        data-sticky
        data-sticky-on="large"
        data-top-anchor="content:top"
        data-btm-anchor="content:bottom"
      >
        <div className="masthead-inner row">
          {/* <!-- local-title --> */}
          <div className="columns medium-6" id="local-title">
            <h1>
              <Link to="../../" title="Back to GIFTs homepage">
                GIFTs
              </Link>
            </h1>
          </div>
          {/* <!-- /local-title --> */}
          {/* <!-- local-nav --> */}
          <div className="columns medium-6">
            {props.location.pathname != '/' && <SearchField {...props} />}
          </div>
          <nav>
            <ul id="local-nav" className="dropdown menu float-left" data-description="navigational">
              <li>
                <Link to="../../">Home</Link>
              </li>
              <li>
                <Link to="../../mappings">Mappings</Link>
              </li>
              <li>
                <Link to="../../feedback">Feedback</Link>
              </li>
              {authenticated ? (
                <li>
                  <Link to="../../logout">Logout</Link>
                </li>
              ) : (
                <li>
                  <Link to="../../login">Login</Link>
                </li>
              )}
            </ul>
          </nav>
          {/* <!-- /local-nav --> */}
        </div>
      </header>
    </div>
  );
}

export default withRouter(Header);
