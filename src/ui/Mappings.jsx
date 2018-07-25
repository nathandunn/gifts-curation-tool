import React, { Component, Fragment } from 'react';

import ResultsTable from './components/ResultsTable';

import '../styles/Home.css';

class Mappings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: '',
    };
  }

  addFilter = (facet, value) => {
    const { filters } = this.state;
    filters[facet] = value;
    this.setState({
      filters,
    });
  };

  removeFilter = (facet) => {
    const { filters } = this.state;
    delete filters[facet];
    this.setState({
      filters,
    });
  };

  render() {
    const propsToPass = {
      addFilter: this.addFilter,
      removeFilter: this.removeFilter,
      params: {
        searchTerm: this.props.searchTerm,
        filters: this.state.filters,
      },
    };
    return <ResultsTable {...propsToPass} />;
  }
}

export default Mappings;
