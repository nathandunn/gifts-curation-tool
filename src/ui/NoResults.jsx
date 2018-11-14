import React from 'react';
import { Link } from 'react-router-dom';

const NoResults = () => (
  <div className="row column medium-8 medium-offset-2">
    <div className="callout text-center">
      <h2>No results!</h2>
      <span role="img" className="h1" aria-label="Half-empty glass">
        🥛
      </span>
      <p className="lead">You could try a different search term or</p>
      <Link to={`${BASE_URL}/mappings`} className="button">
        Explore mappings
      </Link>
    </div>
  </div>
);

export default NoResults;
