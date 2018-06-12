import React, { Component, Fragment } from 'react';
import qs from 'query-string';
import ResultsTable from './components/ResultsTable';
import Filters from './components/Filters';
import '../styles/Home.css';

class Mappings extends Component {
  componentDidMount() {
    // const query = qs.parse(this.props.location.search);
    // TODO update url
  }

  render() {
    if (this.props.searchResults) {
      return (
        <Fragment>
          <h2>Mappings</h2>
          <div className="row">
            <div className="column medium-2">
              <Filters data={this.props.searchResults.facets} addFilter={this.props.addFilter} />
            </div>
            <div className="column medium-10">
              <ResultsTable data={this.props.searchResults} />
            </div>
          </div>
        </Fragment>
      );
    }
    return <span>Loading</span>;
  }
}

export default Mappings;
