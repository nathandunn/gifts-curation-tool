import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import Header from './components/Header';

class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <div id="content">
        <Header {...this.props} />
        {/* <!-- Suggested layout containers --> */}
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            {/* <!-- App content --> */}
            {children}
          </div>
        </section>
      </div>
    );
  }
}

export default Layout;
