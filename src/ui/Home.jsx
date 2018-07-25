import React from 'react';

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
            <button className="button" onClick={props.exploreMappingsAction}>
              Explore Mappings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
