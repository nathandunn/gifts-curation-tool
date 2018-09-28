import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ProteinReviewStatus from './components/ProteinReviewStatus';
import PropTypes from 'prop-types';
import axios from 'axios';

import { formatLargeNumber } from './util/util';

const config = {
  taxons: [{ name: 'Human', value: 9606 }, { name: 'Mouse', value: 10090 }],
  sources: [{ name: 'UniProt', value: 'swissprot' }, { name: 'Ensembl', value: 'ensembl' }],
};

class Unmapped extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taxon: config.taxons[0],
      source: config.sources[0],
      limit: 25,
      offset: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    axios
      .get(`${API_URL}/mappings/unmapped/${this.state.taxon.value}/${
        this.state.source.value
      }/?format=json&limit=${this.state.limit}&offset=${this.state.offset}`)
      .then(d => this.setState({ data: d.data }));
  }

  //   TODO find a cleaner way to pass config type
  handleFilterClick(configType, id, type) {
    const filteredItem = configType.filter(s => s.value === id)[0];
    if (!filteredItem) {
      return;
    }
    this.setState(
      {
        [type]: filteredItem,
        data: null,
      },
      () => this.loadData(),
    );
  }

  paginate(offset) {
    if (offset < 0) {
      return;
    }
    this.setState({ offset, data: null }, () => this.loadData());
  }

  renderEnsemblTable() {
    return (
      <table>
        <thead>
          <tr>
            <th>Gene Name</th>
            <th>Gene ID</th>
            <th>Gene Position</th>
            <th>Transcripts</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.results.map(row => (
            <tr key={row.gene.ensgId}>
              <td>{row.gene.ensgName}</td>
              <td>
                <Link to={`//www.ensembl.org/id/${row.gene.ensgId}`} target="_blank">
                  {row.gene.ensgId}
                </Link>
              </td>
              <td>
                {row.gene.chromosome}:{row.gene.seqRegionStart}-{row.gene.seqRegionEnd}
              </td>
              <td>
                {row.transcripts.map(transcript => (
                  <div key={transcript}>
                    <Link to={`//www.ensembl.org/id/${transcript}`} target="_blank">
                      {transcript}
                    </Link>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  renderUniProtTable() {
    return (
      <table>
        <thead>
          <tr>
            <th>Accession</th>
            <th>Canonical</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.results.map(row => (
            <tr key={row.uniprotAccession}>
              <td>
                <ProteinReviewStatus entryType={row.entryType} />
                <Link to={`//www.uniprot.org/uniprotkb/${row.uniprotAccession}`}>
                  {row.uniprotAccession}
                </Link>
              </td>
              <td>{row.isCanonical ? 'Y' : 'N'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  //   TODO passing too many things here, should try to simplify
  renderFilter(name, value, active, type, conf) {
    return active ? (
      <li key={value}>{name}</li>
    ) : (
      <li key={value}>
        <a onClick={() => this.handleFilterClick(conf, value, type)}>{name}</a>
      </li>
    );
  }

  render() {
    if (!this.state.data) {
      return <LoadingSpinner />;
    }

    return (
      <div className="row column medium-12">
        <h2 className="column medium-20 medium-offset-2">
          {formatLargeNumber(+this.state.data.count)} Unmapped&nbsp;{this.state.source.name}{' '}
          {this.state.taxon.name} entries
        </h2>
        <div className="row">
          <div className="column medium-2">
            <h3>Source</h3>
            <ul className="no-bullet">
              {config.sources.map(source =>
                this.renderFilter(
                  source.name,
                  source.value,
                  source.name === this.state.source.name,
                  'source',
                  config.sources,
                ))}
            </ul>
            <h3>Taxon</h3>
            <ul className="no-bullet">
              {config.taxons.map(taxon =>
                this.renderFilter(
                  taxon.name,
                  taxon.value,
                  taxon.value === this.state.taxon.value,
                  'taxon',
                  config.taxons,
                ))}
            </ul>
          </div>
          <div className="column medium-10">
            {this.state.source.value === 'swissprot' && this.renderUniProtTable()}
            {this.state.source.value === 'ensembl' && this.renderEnsemblTable()}
            <a onClick={() => this.paginate(this.state.offset - this.state.limit)}>
              Previous
            </a>&nbsp;
            <a onClick={() => this.paginate(this.state.offset + this.state.limit)}>Next</a>
          </div>
        </div>
      </div>
    );
  }
}

Unmapped.propTypes = {};

Unmapped.defaultProps = {};

export default withRouter(Unmapped);
