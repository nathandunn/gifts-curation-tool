import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import isEqual from 'lodash-es/isEqual';

import StatusIndicator from './StatusIndicator';
import Filters from './Filters';
import ReviewStatus from './ReviewStatus';
import AlignmentIndicator from './alignment/AlignmentIndicator';
import Position from './Position';
import { formatLargeNumber } from '../util/util';

import '../../styles/ResultsTable.css';

class ResultsTable extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.params, prevState.params)) {
      return {
        params: nextProps.params,
      };
    }
    return null;
  }

  state = {
    displayIsoforms: false,
    expandGroupIndex: null,
  };

  toggleShowIsoforms = () => {
    this.setState({
      displayIsoforms: !this.state.displayIsoforms,
      expandGroupIndex: null,
    });
  };

  toggleExpandGroup = (index) => {
    const { expandGroupIndex } = this.state;

    this.setState({
      expandGroupIndex: (index !== expandGroupIndex)
        ? index
        : null,
    });
  }

  renderRows = (group) => {
    const { rows, taxonomy } = group;

    // -- temp disabled for simplified table
    // return rows.map((mapping) => {
    rows
      .sort((a, b) => {
        if (a.uniprotEntry.isCanonical && !b.uniprotEntry.isCanonical) {
          return 1;
        }

        if (!a.uniprotEntry.isCanonical && b.uniprotEntry.isCanonical) {
          return -1;
        }

        if (a.alignment_difference === null && b.alignment_difference !== null) {
          return -1;
        }

        if (b.alignment_difference === null) {
          return 0;
        }

        return (a.alignment_difference - b.alignment_difference);
      });

    return rows.slice(0, 1).map((mapping) => {
      const key = `${mapping.ensemblTranscript.enstId}_${mapping.uniprotEntry.uniprotAccession}`;

      // -- temp disabled for simplified table
      // if (!this.state.displayIsoforms &&
      //   !mapping.uniprotEntry.isCanonical &&
      //   wrapper.index !== this.state.expandGroupIndex)
      // {
      //   return null;
      // }

      return (
        <Link to={`${BASE_URL}/mapping/${mapping.mappingId}`} key={key} className="table-row">
          <div className="table-cell">
            {/* temporarily disabled 'isoform' flag */}
            {/* !mapping.uniprotEntry.isCanonical &&
              <span className="tree-indent" title="Isoform">isoform</span> */}
          </div>
          <div className="table-cell">
            <StatusIndicator status={mapping.status} />
          </div>
          <div className="table-cell">{mapping.ensemblTranscript.ensgSymbol}</div>
          <div className="table-cell">{mapping.ensemblTranscript.ensgId}</div>
          <div className="table-cell">
            <Position transcript={mapping.ensemblTranscript} />
          </div>
          <div className="table-cell">
            <strong>
              <ReviewStatus entryType={mapping.ensemblTranscript.select ? 'Ensembl' : ''} />
              {mapping.ensemblTranscript.enstId}
            </strong>
          </div>
          <div className="table-cell">
            <strong>
              <ReviewStatus entryType={mapping.uniprotEntry.entryType} />
              {mapping.uniprotEntry.uniprotAccession}
            </strong>
          </div>
          <div className="table-cell">{mapping.uniprotEntry.length}</div>
          <div className="table-cell">{taxonomy.species}</div>
          <div className="table-cell">
            <AlignmentIndicator difference={mapping.alignment_difference} />
          </div>
        </Link>
      );
    });
  };

  renderWrapperRows = (group) => {
    const { wrapper } = group;
    const {
      index,
      gene_symbol,
      ensgId,
      counts,
    } = wrapper;

    return (
      <div className="table-body group-wrapper">
        <div className="table-row group-wrapper-header" onClick={() => this.toggleExpandGroup(index)}>
          <div className="table-cell">
            <span className="badge">
              {(index + 1)}
            </span>
          </div>
          <div className="table-cell" />
          <div className="table-cell">
            {gene_symbol}
          </div>
          <div className="table-cell">
            {ensgId}
          </div>
          <div className="table-cell">
            {(counts.canonical > 0)
              ? (counts.canonical === 1)
                ? <span className="label warning">{`${counts.canonical} Canonical`}</span>
                : <span className="label warning">{`${counts.canonical} Canonicals`}</span>
              : null }

            {(counts.isoform > 0)
              ? (counts.isoform === 1)
                ? <span className="label primary">{`${counts.isoform} Isoform`}</span>
                : <span className="label primary">{`${counts.isoform} Isoforms`}</span>
              : null }
          </div>
          <div className="table-cell" />
          <div className="table-cell" />
          <div className="table-cell" />
          <div className="table-cell" />
          <div className="table-cell" />
        </div>
        {this.renderRows(group)}
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <div className="row column medium-12">
          <h2>{formatLargeNumber(+this.props.rowCount)} Mapping(s)</h2>
        </div>
        <div className="row">
          <div className="column medium-2">
            <Filters
              data={this.props.facets}
              addFilter={this.props.addFilter}
              removeFilter={this.props.removeFilter}
              activeFacets={this.props.activeFacets}
              selectedFilters={this.props.selectedFilters}
              toggleFilter={this.props.toggleFilter}
            />
          </div>
          <div className="column medium-10">
            {/* <button className="button" onClick={() => this.toggleShowIsoforms()}>
              {this.state.displayIsoforms ? 'Hide' : 'Show'} Isoforms
            </button> */}
            <div className="table tbody-zebra">
              <div className="table-head">
                <div className="table-row">
                  <div className="table-cell" />
                  <div className="table-cell" />
                  <div className="table-cell">Gene symbol</div>
                  <div className="table-cell">Gene ID</div>
                  <div className="table-cell">Position</div>
                  <div className="table-cell">Transcript</div>
                  <div className="table-cell">Protein</div>
                  <div className="table-cell">Length</div>
                  <div className="table-cell">Organism</div>
                  <div className="table-cell">&nbsp;</div>
                </div>
              </div>
              {/* this.props.results && this.props.results.map(row => (
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
              )) */}

              {/* this.props.results && this.props.results.map(group => {
                // return this.renderWrapperRows(group);
                return this.renderRows(group);
              }) */}

              {this.props.results && this.props.results.map(group => this.renderRows(group))}
            </div>
            <ReactPaginate
              pageCount={this.props.pageCount}
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
  addFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  activeFacets: PropTypes.shape.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  initialPage: PropTypes.number.isRequired,
  facets: PropTypes.arrayOf(PropTypes.shape),
  results: PropTypes.arrayOf(PropTypes.shape),
  pageCount: PropTypes.number,
};

ResultsTable.defaultProps = {
  facets: [],
  results: [],
  pageCount: 0,
};

export default ResultsTable;
