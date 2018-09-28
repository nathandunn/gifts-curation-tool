import React from 'react';
import PropTypes from 'prop-types';

import SearchField from './components/SearchField';
import Statistics from './components/Statistics';

import '../styles/Home.css';

const Home = props => (
  <main>
    <div className="home-banner">
      <div className="column medium-offset-3 medium-6 text-center">
        <h5>Search for a mapping:</h5>
        <SearchField {...props} />
        <div className="home-banner__actions">
          <button className="button" onClick={props.exploreMappingsAction}>
            Explore Mappings
          </button>
        </div>
      </div>
    </div>
    <Statistics />
  </main>
);

Home.propTypes = {
  exploreMappingsAction: PropTypes.func.isRequired,
};

export default Home;
