import React from 'react';
import { Link } from 'react-router-dom';

import SearchField from './components/SearchField';

import '../styles/Home.css';

function Home(props) {
  return (
    <main>
      <div className="row home-banner">
        <div className="medium-offset-3 medium-6 text-center">
          <h5>Search for a mapping:</h5>
          <SearchField {...props} />
          <div className="home-banner__actions">
            <Link to="/mappings/" className="button">
              Explore mappings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
