import React, { Component, Fragment } from 'react';
import qs from 'query-string';
import axios from 'axios';

import ResultsTable from './components/ResultsTable';
import Filters from './components/Filters';

import '../styles/Home.css';

class Mappings extends Component {

  state = {
    searchTerm: null,
    filters: {},
    searchResults: null
  }

  constructor(props) {
    super(props);

    const { searchTerm, filters } = props;
    this.handleSearch(searchTerm, filters);
  }

  componentDidMount() {
    // const query = qs.parse(this.props.location.search);
    // TODO update url
    const { searchTerm, filters } = this.props;

    this.setState({
      searchTerm,
      filters
    });
  }

  handleSearch = (searchTerm, filters) => {
    searchTerm = searchTerm || 'test';
    const accession = searchTerm;
    const apiURI = `http://localhost:3000/api/search/${accession}`;
    const params = {
      searchTerm,
      ...filters
    };

    axios.get(apiURI, { params })
      .then(response => {
        this.setState({
          searchTerm: searchTerm,
          searchResults: response.data,
        });
      });
  }

  render() {
    const { searchResults } = this.state;

    if (searchResults) {
      return (
        <Fragment>
          <h2>Mappings</h2>
          <div className="row">
            <div className="column medium-2">
              <Filters
                data={searchResults.facets}
                addFilter={this.props.addFilter}
                removeFilter={this.props.removeFilter}
              />
            </div>
            <div className="column medium-10">
              <ResultsTable data={searchResults} />
            </div>
          </div>
        </Fragment>
      );
    }
    return <span>Loading</span>;
  }
}

export default Mappings;
