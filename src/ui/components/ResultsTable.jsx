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
        : null
    });
  }

  renderRows = (group) => {
    const { rows, taxonomy, wrapper } = group;

    return rows.map((mapping) => {
      const key = `${mapping.ensemblTranscript.enstId}_${mapping.uniprotEntry.uniprotAccession}`;

      // if (!this.state.displayIsoforms && !mapping.uniprotEntry.isCanonical) {
      if (!this.state.displayIsoforms && !mapping.uniprotEntry.isCanonical && wrapper.index !== this.state.expandGroupIndex) {
        return null;
      }

      return (
        <Link to={`${BASE_URL}/mapping/${mapping.mappingId}`} key={key} className="table-row">
          <div className="table-cell">
            {!mapping.uniprotEntry.isCanonical && <span className="tree-indent" title="Isoform">isoform</span>}
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
            <span class="badge">
              {(index + 1)}
            </span>
          </div>
          <div className="table-cell"></div>
          <div className="table-cell">
            {gene_symbol}
          </div>
          <div className="table-cell">
            {ensgId}
          </div>
          <div className="table-cell">
            {(0 < counts.canonical)
              ? (1 === counts.canonical)
                ? <span class="label warning">{`${counts.canonical} Canonical`}</span>
                : <span class="label warning">{`${counts.canonical} Canonicals`}</span>
              : null }

            {(0 < counts.isoform)
              ? (1 === counts.isoform)
                ? <span class="label primary">{`${counts.isoform} Isoform`}</span>
                : <span class="label primary">{`${counts.isoform} Isoforms`}</span>
              : null }
          </div>
          <div className="table-cell"></div>
          <div className="table-cell"></div>
          <div className="table-cell"></div>
          <div className="table-cell"></div>
          <div className="table-cell"></div>
        </div>
        {this.renderRows(group)}
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        {/* <div className="row column medium-12">
          <h2>{formatLargeNumber(+this.state.totalCount)} Mapping(s)</h2>
          This is confusing as it shows the number of hits, not the number of mappings shown.
        </div> */}
        <div className="row">
          <div className="column medium-2">
            <Filters
              data={this.props.facets}
              addFilter={this.props.addFilter}
              removeFilter={this.props.removeFilter}
              activeFacets={this.props.activeFacets}
            />
          </div>
          <div className="column medium-10">
            <button className="button" onClick={() => this.toggleShowIsoforms()}>
              {this.state.displayIsoforms ? 'Hide' : 'Show'} Isoforms
            </button>
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

              {this.props.results && this.props.results.map(group => {
                // return this.renderRows(group.rows, group.taxonomy);
                return this.renderWrapperRows(group);
              })}
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
  activeFacets: PropTypes.object.isRequired,
  handlePageClick: PropTypes.func.isRequired,
  initialPage: PropTypes.number.isRequired,
  facets: PropTypes.array,
  results: PropTypes.array,
  pageCount: PropTypes.number,
};

ResultsTable.defaultProps = {
  facets: [],
  results: [],
  pageCount: 0,
};

export default ResultsTable;
