import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import SearchField from './components/SearchField';
import Statistics from './components/Statistics';

import '../styles/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
    };
  }

  componentDidMount() {
    this.getStats();
  }

  getStats = () => {
    axios.get(`${API_URL}/mappings/stats/?format=json`).then(d => this.setState({ stats: d.data }));
  };

  render() {
    const { stats } = this.state;

    return (
      <main>
        <div className="home-banner">
          <div className="column medium-offset-3 medium-6 text-center">
            <h5>Search for a mapping:</h5>
            <SearchField {...this.props} />
            <div className="home-banner__actions">
              <button className="button" onClick={this.props.exploreMappingsAction}>
                Explore Mappings
              </button>
            </div>
          </div>
        </div>
        <Statistics />
      </main>
    );
  }
}

Home.propTypes = {
  exploreMappingsAction: PropTypes.func.isRequired,
};

export default Home;
