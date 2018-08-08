import React, { Component } from 'react';
import axios from 'axios';

import { formatStatusName, formatLargeNumber } from './util/util';
import SearchField from './components/SearchField';
import Status from './components/Status';

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
          <div className="column medium-4">
            <h3>Total mappings</h3>
            <h4>{this.state.stats ? formatLargeNumber(this.state.stats.totalMappingCount) : 0}</h4>
          </div>
          <div className="column medium-8">
            {this.state.stats
              ? this.state.stats.statusMappingCount.map(statusCount => (
                <div>
                  <h4>
                    <Status status={statusCount.status} />
                    {formatStatusName(statusCount.status)}: {formatLargeNumber(statusCount.count)}
                  </h4>
                </div>
                ))
              : null}
          </div>
        </div>
      </main>
    );
  }
}

export default Home;
