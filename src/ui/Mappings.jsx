import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'query-string';
import ResultsTable from './components/ResultsTable';
import Filters from './components/Filters';
import '../styles/Home.css';

class Mappings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // const query = qs.parse(this.props.location.search);
    axios
      .get(`http://localhost:3000/gifts/mappings${this.props.location.search}`)
      .then(d => this.setState({ data: d.data }));
  }

  render() {
    return (
      <Fragment>
        <h2>Mappings</h2>
        <div className="row">
          <div className="column medium-2">
            <Filters data={this.state.data.facets} />
          </div>
          <div className="column medium-10">
            <ResultsTable data={this.state.data} />
          </div>
        </div>
      </Fragment>
    );
  }
}

Mappings.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Mappings);
