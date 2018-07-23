import React, { Component, Fragment } from 'react';
import qs from 'query-string';
import axios from 'axios';

import ResultsTable from './components/ResultsTable';
import Filters from './components/Filters';
import Paginator from './components/Pagination';

import '../styles/Home.css';

class Mappings extends Component {
  state = {
    searchTerm: null,
    filters: {},
    searchResults: null,
  };

  constructor(props) {
    super(props);
    const { searchTerm, filters } = props;
    this.handleSearch(searchTerm, filters);
  }

  componentDidMount() {
    // const query = qs.parse(this.props.location.search);
    // TODO update url

    this.setStateFromProps();
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchTerm, filters } = this.props;

    if (!this.hasSearchParamsChanged(searchTerm, filters)) {
      return false;
    }

    this.setStateFromProps(() => {
      const { searchTerm, filters } = this.state;
      this.handleSearch(searchTerm, filters);
    });
  }

  setStateFromProps = (callback) => {
    const { searchTerm, filters } = this.props;
    callback = callback || null;

    this.setState(
      {
        searchTerm,
        filters,
      },
      callback,
    );
  };

  handleSearch = (searchTerm, filters, offset = 0, itemsPerPage = 25) => {
    searchTerm = searchTerm || '';
    const accession = searchTerm;
    const apiURI = `${API_URL}/mappings/?searchTerm=${accession}&offset=${offset}&limit=${itemsPerPage}&format=json`;
    const params = {
      ...filters,
    };

    return axios.get(apiURI, { params }).then((response) => {
      this.setState({
        searchResults: response.data,
      });
      return response.data;
    });
  };

  hasSearchParamsChanged = (searchTerm, filters) => {
    if (this.props.searchTerm !== searchTerm) {
      return true;
    }

    let hasChanged = false;

    Object.keys(this.props.filters).forEach((key) => {
      if (this.props.filters.hasOwnProperty(key)) {
        if (filters.hasOwnProperty(key)) {
          if (this.props.filters[key] !== filters[key]) {
            hasChanged = true;
          }
        } else {
          hasChanged = true;
        }
      }
    });

    return hasChanged;
  };

  fetchPage = (currentPage, itemsPerPage) => {
    const offSet = (currentPage - 1) * itemsPerPage;
    return this.handleSearch(this.state.searchTerm, this.state.filters, offSet, itemsPerPage);
  };

  render() {
    const { searchResults, filters } = this.state;
    console.log('- mappings render:', this.state);
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
              <ResultsTable data={searchResults} fetchPage={this.fetchPage} />
            </div>
          </div>
        </Fragment>
      );
    }
    return <span>Loading</span>;
  }
}

export default Mappings;
