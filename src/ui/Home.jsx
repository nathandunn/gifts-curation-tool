import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import SearchField from './components/SearchField';
import TotalMappingsStats from './components/TotalMappingsStats';
import MappingStatusStats from './components/MappingStatusStats';

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
        <div className="row">
          <div className="column medium-3">
            <TotalMappingsStats total={stats && stats.mapping.total} />
          </div>
        </div>
        <div className="row">
          <MappingStatusStats stats={stats && stats.status} />
        </div>
      </main>
    );
  }
}

Home.propTypes = {
  exploreMappingsAction: PropTypes.func.isRequired,
};

export default Home;
