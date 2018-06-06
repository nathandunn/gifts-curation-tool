
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Layout extends Component {

  render() {
    const { authenticated, user, children } = this.props;

    return(
      <div id="content">
        <div data-sticky-container>
          <header id="masthead" className="masthead" data-sticky data-sticky-on="large" data-top-anchor="content:top" data-btm-anchor="content:bottom">
            <div className="masthead-inner row">
              { /* <!-- local-title --> */ }
              <div className="columns medium-12" id="local-title">
                <h1><Link to="../../" title="Back to GIFTs homepage">GIFTs</Link></h1>
              </div>
              { /* <!-- /local-title --> */ }
              { /* <!-- local-nav --> */ }
              <nav >
                <ul id="local-nav" className="dropdown menu float-left" data-description="navigational">
                  <li><Link to="../../">Overview</Link></li>
                  <li><Link to="../../">Mappings</Link></li>

                  {(authenticated)
                      ? <li><Link to="../../logout">Logout</Link></li>
                      : <li><Link to="../../login">Login</Link></li>}
                </ul>
              </nav>
              { /* <!-- /local-nav --> */ }
            </div>
          </header>
        </div>
        { /* <!-- Suggested layout containers --> */ }
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            { /* <!-- App content --> */ }
            { children }
          </div>
        </section>
      </div>
    );
  }
}

export default Layout;
