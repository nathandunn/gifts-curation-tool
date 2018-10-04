import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import isEqual from 'lodash-es/isEqual';

import LoadingSpinner from './LoadingSpinner';
import StatusIndicator from './StatusIndicator';
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

  state = {
    displayIsoforms: false,
  };

  componentDidMount() {
    this.loadResults();
  }

  componentDidUpdate() {
    if (this.state.results === null) {
      this.loadResults();
    }
  }

  loadResults = () => {
    const { params, history, clearSearchTerm } = this.props;
    const apiURI = `${API_URL}/mappings`;

    axios
      .get(apiURI, { params })
      .then(({ data, status }) => {
        if (status === 204) {
          clearSearchTerm(() => {
            history.push(`${BASE_URL}/no-results`);
          });

          return;
        }

        this.setState({
          params: this.props.params,
          facets: data.facets,
          results: data.results,
          totalCount: data.count,
        });
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  groupByIsoform = results =>
    results.map(row => ({
      taxonomy: row.taxonomy,
      canonical: row.entryMappings.filter(mapping => mapping.uniprotEntry.isCanonical === true),
      isoforms: row.entryMappings.filter(mapping => mapping.uniprotEntry.isCanonical === false),
    }));

  toggleShowIsoforms = () => {
    this.setState({ displayIsoforms: !this.state.displayIsoforms });
  }

  renderRows = (items, taxonomy) => {
    return items.map((mapping) => {
      const key = `${mapping.ensemblTranscript.enstId}_${mapping.uniprotEntry.uniprotAccession}`;

      const position = `${mapping.ensemblTranscript.chromosome || 'NA'}:${formatLargeNumber(+mapping.ensemblTranscript.seqRegionStart)}-${formatLargeNumber(+mapping.ensemblTranscript.seqRegionEnd)}`;

      return (
        <Link to={`${BASE_URL}/mapping/${mapping.mappingId}`} key={key} className="table-row">
          <div className="table-cell">{!mapping.uniprotEntry.isCanonical && <span className="tree-indent" />}</div>
          <div className="table-cell">
            <StatusIndicator status={mapping.status} />
          </div>
          <div className="table-cell">{mapping.ensemblTranscript.ensgName}</div>
          <div className="table-cell">{mapping.uniprotEntry.gene_symbol}</div>
          <div className="table-cell">{mapping.ensemblTranscript.ensgId}</div>
          <div className="table-cell">{position}</div>
          <div className="table-cell">
            <strong>{mapping.ensemblTranscript.enstId}</strong>
          </div>
          <div className="table-cell">
            <strong>
              <ProteinReviewStatus entryType={mapping.uniprotEntry.entryType} />
              {mapping.uniprotEntry.uniprotAccession}
            </strong>
          </div>
          <div className="table-cell">{taxonomy.species}</div>
          <div className="table-cell">
            <AlignmentIndicator difference={mapping.alignment_difference} />
          </div>
        </Link>
      );
    });
  }

  render() {
    if (this.state.totalCount <= 0) {
      return <LoadingSpinner />;
    }
    const groupedResults = this.groupByIsoform(this.state.results);

    return (
      <Fragment>
        {/* <div className="row column medium-12">
          <h2>{formatLargeNumber(+this.state.totalCount)} Mapping(s)</h2>
          This is confusing as it shows the number of hits, not the number of mappings shown.
        </div> */}
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
            <button className="button" onClick={e => this.toggleShowIsoforms()}>{this.state.displayIsoforms ? 'Hide' : 'Show'} Isoforms</button>
            <div className="table tbody-zebra">
              <div className="table-head">
                <div className="table-row">
                  <div className="table-cell" />
                  <div className="table-cell" />
                  <div className="table-cell">Gene Name</div>
                  <div className="table-cell">HGNC</div>
                  <div className="table-cell">Gene ID</div>
                  <div className="table-cell">Position</div>
                  <div className="table-cell">Transcript</div>
                  <div className="table-cell">Protein</div>
                  <div className="table-cell">Organism</div>
                  <div className="table-cell">&nbsp;</div>
                </div>
              </div>
              {groupedResults.map(row => (
                <div
                  className="table-body"
                  key={row.canonical.reduce(
                    (total, mapping) =>
                      (total ? `${total}_${mapping.mappingId}` : mapping.mappingId),
                    undefined,
                  )}
                >
                  {this.renderRows(row.canonical, row.taxonomy)}
                  {this.state.displayIsoforms && this.renderRows(row.isoforms, row.taxonomy)}
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
