import React, { Component, Fragment } from 'react';

import ResultsTable from './components/ResultsTable';

import '../styles/Home.css';

class Mappings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      limit: 15,
      facets: {},
      initialPage: 0,
    };
  }

  handlePageClick = (data) => {
    const initialPage = data.selected;
    const offset = Math.ceil(initialPage * this.state.limit);
    this.setState({ offset, initialPage });
  };

  addFilter = (facet, value) => {
    const { facets } = this.state;
    facets[facet] = value;
    this.setState({
      facets,
    });
  };

  removeFilter = (facet) => {
    const { facets } = this.state;
    delete facets[facet];
    this.setState({
      facets,
    });
  };

  getFacetsAsString = facets =>
    Object.keys(this.state.facets)
      .map(key => `${key}:${this.state.facets[key]}`)
      .join(',');

  render() {
    const propsToPass = {
      addFilter: this.addFilter,
      removeFilter: this.removeFilter,
      handlePageClick: this.handlePageClick,
      params: {
        searchTerm: this.props.searchTerm,
        facets: this.getFacetsAsString(this.state.facets),
        offset: this.state.offset,
        limit: this.state.limit,
        format: 'json',
      },
      initialPage: this.state.initialPage,
    };
    return <ResultsTable {...propsToPass} />;
  }
}

export default Mappings;
