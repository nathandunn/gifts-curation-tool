import React from 'react';
import { withRouter } from 'react-router-dom';
import SearchComponent from './SearchComponent';

function Header(props) {
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
          <div className="columns medium-6" id="local-title">
            <h1>
              <a href="../../" title="Back to GIFTs homepage">
                GIFTs
              </a>
            </h1>
          </div>
          <div className="columns medium-6">
            {props.location.pathname != '/' && <SearchComponent {...props} />}
          </div>
          <nav>
            <ul id="local-nav" className="dropdown menu float-left" data-description="navigational">
              <li>
                <a href="../../">Overview</a>
              </li>
              <li>
                <a>Mappings</a>
              </li>
              <li>
                <a href="../../login">Login</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default withRouter(Header);
