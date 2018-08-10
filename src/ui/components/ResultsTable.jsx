import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import isEqual from 'lodash-es/isEqual';

import LoadingSpinner from './LoadingSpinner';
import Status from './Status';
import Filters from './Filters';
import ProteinReviewStatus from './ProteinReviewStatus';
import AlignmentIndicator from './AlignmentIndicator';
import { formatLargeNumber } from '../util/util';

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
    const { history, clearSearchTerm } = this.props;
    const apiURI = `${API_URL}/mappings`;
console.log("RESULTS props:", this.props);
    axios
      .get(apiURI, { params: this.props.params })
      .then((d) => {
        if (204 === d.status ) {
          clearSearchTerm(() => {
            history.push('/no-results');
          });

          return;
        }

        this.setState({
          params: this.props.params,
          facets: d.data.facets,
          results: d.data.results,
          totalCount: d.data.count,
        });
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  };

  render() {
    if (this.state.totalCount <= 0) {
      return <LoadingSpinner />;
    }

    // if (this.state.totalCount > 0) {

    return (
      <Fragment>
        <div className="row column medium-12">
          <h2>{formatLargeNumber(+this.state.totalCount)} Mapping(s)</h2>
        </div>
        <div className="row">
          <div className="column medium-2">
            <Filters
              data={this.state.facets}
              addFilter={this.props.addFilter}
              removeFilter={this.props.removeFilter}
              activeFacets={this.props.activeFacets}
            />
          </div>
          <div className="column medium-10">
            <div className="table tbody-zebra">
              <div className="table-head">
                <div className="table-row">
                  <div className="table-cell" />
                  <div className="table-cell">Protein</div>
                  <div className="table-cell">Transcript</div>
                  <div className="table-cell">Gene</div>
                  <div className="table-cell table-cell--number">Start</div>
                  <div className="table-cell table-cell--number">End</div>
                  <div className="table-cell">Organism</div>
                  <div className="table-cell">&nbsp;</div>
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
                        <div className="table-cell">
                          <strong>
                            <ProteinReviewStatus entryType={mapping.uniprotEntry.entryType} />
                            {mapping.uniprotEntry.uniprotAccession}
                          </strong>
                        </div>
                        <div className="table-cell">
                          <strong>{mapping.ensemblTranscript.enstId}</strong>
                        </div>
                        <div className="table-cell">{mapping.ensemblTranscript.ensgId}</div>
                        <div className="table-cell table-cell--number">
                          {formatLargeNumber(+mapping.ensemblTranscript.seqRegionStart)}
                        </div>
                        <div className="table-cell table-cell--number">
                          {formatLargeNumber(+mapping.ensemblTranscript.seqRegionEnd)}
                        </div>
                        <div className="table-cell">{row.taxonomy.species}</div>
                        <div className="table-cell">
                          <AlignmentIndicator difference={mapping.alignment_difference} />
                        </div>
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
}

ResultsTable.propTypes = {
  params: PropTypes.object.isRequired,
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  activeFacets: PropTypes.object.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  initialPage: PropTypes.number.isRequired,
};

export default ResultsTable;
