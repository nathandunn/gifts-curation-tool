import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { formatStatusName, formatLargeNumber } from './util/util';
import SearchField from './components/SearchField';
import StatusIndicator from './components/StatusIndicator';

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
            <h3>Total mappings</h3>
            <span className="stat">
              {this.state.stats ? formatLargeNumber(this.state.stats.totalMappingCount) : 0}
            </span>
          </div>
        </div>
        <div className="row">
          {this.state.stats
            ? this.state.stats.statusMappingCount.map((statusCount, index) => (
              <div key={`status-${index}`} className="column medium-3">
                <h4>{formatStatusName(statusCount.status)}</h4>
                <span className="stat">
                  <StatusIndicator status={statusCount.status} />
                  {formatLargeNumber(statusCount.count)}
                </span>
              </div>
              ))
            : null}
        </div>
      </main>
    );
  }
}

Home.propTypes = {
  exploreMappingsAction: PropTypes.func.isRequired,
};

export default Home;
