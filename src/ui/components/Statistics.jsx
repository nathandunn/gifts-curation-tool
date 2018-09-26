import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import TotalMappingsStats from './TotalMappingsStats';
import MappingStatusStats from './MappingStatusStats';
import UniProtStats from './UniProtStats';
import EnsemblStats from './EnsemblStats';
import LoadingSpinner from './LoadingSpinner';

import '../../styles/Statistics.css';

class Statistics extends Component {
  state = {
    stats: null,
  };

  componentDidMount() {
    this.getStats();
  }

  getStats = () => {
    const { history } = this.props;
    axios
      .get(`${API_URL}/mappings/stats/?format=json`)
      .then(response => this.setState({ stats: response.data }))
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  render() {
    const { stats } = this.state;

    if (stats <= 0) {
      return <LoadingSpinner />;
    }

    return (
      <Fragment>
        <div className="row">
          <div className="column medium-3">
            <h2>About</h2>
            <p>
              This project aims to provide a common framework for Ensembl and UniProt data. This
              infrastructure will enable both teams to read and comment on data, track entities
              between resources and support mappings between entities.
            </p>
            <TotalMappingsStats total={stats && stats.mapping.total} />
          </div>
          <div className="column medium-3">
            <UniProtStats
              total={stats && stats.mapping.total}
              mapped={stats && stats.mapping.uniprot.mapped}
              notMapped={stats && stats.mapping.uniprot.not_mapped_sp}
            />
          </div>
          <div className="column medium-3">
            <EnsemblStats
              total={stats && stats.mapping.total}
              geneMapped={stats && stats.mapping.ensembl.gene_mapped}
              geneNotMapped={stats && stats.mapping.ensembl.gene_not_mapped_sp}
              transMapped={stats && stats.mapping.ensembl.transcript_mapped}
            />
          </div>
          <div className="column medium-3">
            <MappingStatusStats
              total={stats && stats.mapping.total}
              stats={stats && stats.status}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Statistics);
