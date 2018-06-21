import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'query-string';
import ResultsTable from './components/ResultsTable';
import Filters from './components/Filters';
import '../styles/Home.css';

class Mappings extends Component {

  state = {
    searchTerm: null,
    searchResults: null
  }

  constructor(props) {
    super(props);

    const { query } = props;
    this.handleSearch(query);
  }

  componentDidMount() {
    // const query = qs.parse(this.props.location.search);
    // TODO update url
  }

  handleSearch = term => {
    term = term || 'test';
    const accession = term;
    const apiURI = `http://localhost:3000/api/search/${accession}`;
    axios.get(apiURI)
      .then(response => {
        console.log("handleSearch response:", response);
        this.setState({
          searchTerm: term,
          searchResults: response.data,
        });
        console.log("term:", `mappings/${term}`);
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
              <Filters data={searchResults.facets} />
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
