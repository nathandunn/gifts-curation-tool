import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { isEqual } from 'lodash-es';

import LoadingSpinner from './LoadingSpinner';
import Status from './Status';
import Filters from './Filters';

import '../../styles/ResultsTable.css';

class ResultsTable extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.params, prevState.params)) {
      return {
        params: nextProps.params,
        facets: null,
        results: null,
        totalCount: 0,
      };
    }
    return null;
  }

  state = {};

  componentDidMount() {
    this.loadResults();
  }

  componentDidUpdate() {
    if (this.state.results === null) {
      this.loadResults();
    }
  }

  loadResults = () => {
    const apiURI = `${API_URL}/mappings`;

    // fetch(apiURI, {
    //   method: 'GET',
    //   mode: "cors",
    //   headers: {
    //     'Authorization': '--TEST--'
    //   }
    // })
    // .then(response => response.json())
    // .catch(error => console.error(`Fetch Error =\n`, error));

    axios
      .get(apiURI, { params: this.props.params })
      // .get(apiURI, { params: this.props.params, headers: { 'Authorization': 'TEST' } })
      // .get(apiURI, { params: this.props.params, auth: {'user': 'TEST'}, withCredentials: true })
      .then((d) => {
        this.setState({
          params: this.props.params,
          facets: d.data.facets,
          results: d.data.results,
          totalCount: d.data.count,
        });
      })
      .catch( e => {
        console.log(e.response);
        history.push('/error');
      });
  };

  render() {

    if (0 >= this.state.totalCount) {
      return <LoadingSpinner />;
    }

    // if (this.state.totalCount > 0) {
    else {
      return (
        <Fragment>
          <h2>{this.state.totalCount} Mapping(s)</h2>
          <div className="row">
            <div className="column medium-2">
              <Filters
                data={this.state.facets}
                addFilter={this.props.addFilter}
                removeFilter={this.props.removeFilter}
              />
            </div>
            <div className="column medium-10">
              <div className="table tbody-zebra">
                <div className="table-head">
                  <div className="table-row">
                    <div className="table-cell" />
                    <div className="table-cell">Gene</div>
                    <div className="table-cell">Transcript</div>
                    <div className="table-cell">Start</div>
                    <div className="table-cell">End</div>
                    <div className="table-cell">Protein</div>
                    <div className="table-cell">Organism</div>
                  </div>
                </div>
                {this.state.results.map(row => (
                  <div
                    className="table-body"
                    key={row.entryMappings.reduce(
                      (total, mapping) =>
                        (total ? `${total}_${mapping.mappingId}` : mapping.mappingId),
                      undefined,
                    )}
                  >
                    {row.entryMappings.map((mapping) => {
                      const key = `${mapping.ensemblTranscript.enstId}_${
                        mapping.uniprotEntry.uniprotAccession
                      }`;
                      return (
                        <Link to={`/mapping/${mapping.mappingId}`} key={key} className="table-row">
                          <div className="table-cell">
                            <Status status={mapping.status} />
                          </div>
                          <div className="table-cell">{mapping.ensemblTranscript.enstId}</div>
                          <div className="table-cell">{mapping.ensemblTranscript.ensgId}</div>
                          <div className="table-cell">
                            {mapping.ensemblTranscript.seqRegionStart}
                          </div>
                          <div className="table-cell">{mapping.ensemblTranscript.seqRegionEnd}</div>
                          <div className="table-cell">{mapping.uniprotEntry.uniprotAccession}</div>
                          <div className="table-cell">{row.taxonomy.species}</div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
              <ReactPaginate
                pageCount={Math.ceil(this.state.totalCount / this.state.params.limit)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.props.handlePageClick}
                initialPage={this.props.initialPage}
                containerClassName="results-paginate"
              />
            </div>
          </div>
        </Fragment>
      );
    }
    return null;
  }
}
export default ResultsTable;
