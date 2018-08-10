import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

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

  getFacetsAsString = () =>
    Object.keys(this.state.activeFacets)
      .map(key => `${key}:${this.state.activeFacets[key]}`)
      .join(',');

  removeFilter = (facet) => {
    const { activeFacets } = this.state;
    delete activeFacets[facet];
    this.setState({
      activeFacets,
    });
  };

  addFilter = (facet, value) => {
    const { activeFacets } = this.state;
    activeFacets[facet] = value;
    this.setState({
      activeFacets,
    });
  };

  handlePageClick = (data) => {
    const initialPage = data.selected;
    const offset = Math.ceil(initialPage * this.state.limit);
    this.setState({ offset, initialPage });
  };

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
      history: this.props.history,
      initialPage: this.state.initialPage,
      clearSearchTerm: this.props.clearSearchTerm,
    };
    return <ResultsTable {...propsToPass} />;
  }
}

Mappings.propTypes = {
  searchTerm: PropTypes.string,
};

Mappings.defaultProps = {
  searchTerm: '',
};

export default withRouter(Mappings);
