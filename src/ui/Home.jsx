import React, { Component } from 'react';

import SearchField from './components/SearchField';

import '../styles/Home.css';

function Home(props) {
  return (
    <main>
      <div className="row home-banner">
        <div className="medium-offset-3 medium-6 text-center">
          <h5>Helping biologists one mapping at a time</h5>
          <SearchField {...props} />
          <div className="home-banner__actions">
            <a className="button">Explore mappings</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
