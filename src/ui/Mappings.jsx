import React, { Component, Fragment } from 'react';
import ResultsTable from './components/ResultsTable';

import '../styles/Home.css';

class Mappings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      limit: 15,
      activeFacets: {},
      initialPage: 0,
    };
  }

  handlePageClick = (data) => {
    const initialPage = data.selected;
    const offset = Math.ceil(initialPage * this.state.limit);
    this.setState({ offset, initialPage });
  };

  addFilter = (facet, value) => {
    const { activeFacets } = this.state;
    activeFacets[facet] = value;
    this.setState({
      activeFacets,
    });
  };

  removeFilter = (facet) => {
    const { activeFacets } = this.state;
    delete activeFacets[facet];
    this.setState({
      activeFacets,
    });
  };

  getFacetsAsString = facets =>
    Object.keys(this.state.activeFacets)
      .map(key => `${key}:${this.state.activeFacets[key]}`)
      .join(',');

  render() {
    const propsToPass = {
      addFilter: this.addFilter,
      removeFilter: this.removeFilter,
      handlePageClick: this.handlePageClick,
      activeFacets: this.state.activeFacets,
      params: {
        searchTerm: this.props.searchTerm,
        facets: this.getFacetsAsString(this.state.activeFacets),
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
