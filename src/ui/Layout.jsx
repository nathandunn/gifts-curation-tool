import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';

const Layout = (props) => {
  const { children } = props;

  return (
    <div id="content">
      <Header {...props} />
      {/* <!-- Suggested layout containers --> */}
      <section id="main-content-area" role="main">
        <div id="root">
          {/* <!-- App content --> */}
          {children}
        </div>
      </section>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
