import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import TotalMappingsStats from './components/TotalMappingsStats';
import MappingStatusStats from './components/MappingStatusStats';
import UniProtStats from './components/UniProtStats';
import EnsemblStats from './components/EnsemblStats';

import '../styles/Statistics.css';

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
      .catch(e => {
        console.log(e);
        history.push('/error');
      });
  }

  render() {
    const { stats } = this.state;

    return (
      <Fragment>
        <div className="row">
          <div className="column medium-8">
            <TotalMappingsStats total={stats && stats.mapping.total} />
          </div>
        </div>

        <UniProtStats
          mapped={stats && stats.mapping.uniprot.mapped}
          notMapped={stats && stats.mapping.uniprot.not_mapped_sp}
        />

        <EnsemblStats
          geneMapped={stats && stats.mapping.ensembl.gene_mapped}
          geneNotMapped={stats && stats.mapping.ensembl.gene_not_mapped_sp}
          transMapped={stats && stats.mapping.ensembl.transcript_mapped}
        />

        <div className="row">
          <MappingStatusStats stats={stats && stats.status} />
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Statistics);
