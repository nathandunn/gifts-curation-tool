import React from 'react';
import PropTypes from 'prop-types';

import SearchField from './components/SearchField';
import Statistics from './components/stats/Statistics';

import '../styles/Home.scss';

const Home = props => (
  <main>
    <div className="home-banner">
      <div className="column medium-offset-3 medium-6 text-center">
        <h5>Search for a mapping:</h5>
        <SearchField {...props} />
        <div className="home-banner__actions">
          <button className="button" onClick={() => props.exploreMappingsByOrganism(9606)}>
            Explore Human
          </button>
          &nbsp;
          <button className="button" onClick={() => props.exploreMappingsByOrganism(10090)}>
            Explore Mouse
          </button>
        </div>
      </div>
    </div>
    <Statistics />
  </main>
);

Home.propTypes = {
  exploreMappingsByOrganism: PropTypes.func.isRequired,
};

export default Home;
