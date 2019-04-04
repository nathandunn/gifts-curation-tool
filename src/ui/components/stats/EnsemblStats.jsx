import React from 'react';
import PropTypes from 'prop-types';

import { formatLargeNumber } from '../../util/util';
import DoughnutChart from './DoughnutChart';

const EnsemblStats = (props) => {
  const {
    genes_total,
    genes_unmapped,
    transcripts_total,
    transcripts_unmapped,
    ensembl,
  } = props;
  const color = '#336';
  const genesMapped = genes_total - genes_unmapped;
  const transcriptsMapped = transcripts_total - transcripts_unmapped;

  return (
    <div className="column medium-6">
      <h3 style={{ color }} className="column medium-12">
        Ensembl&nbsp;
        <small>{ensembl}</small>
      </h3>
      <div className="stats-item column medium-6">
        <h5>Genes Mapped</h5>
        <DoughnutChart
          color={color}
          percent={Math.floor((genesMapped / genes_total) * 100)}
        />
        <span className="stat">{genesMapped ? formatLargeNumber(genesMapped) : 'NA'}</span>
      </div>
      <div className="stats-item column medium-6 end">
        <h5>Transcripts Mapped</h5>
        <DoughnutChart
          color={color}
          percent={Math.floor((transcriptsMapped / transcripts_total) * 100)}
        />
        <span className="stat">
          {transcriptsMapped ? formatLargeNumber(transcriptsMapped) : 'NA'}
        </span>
      </div>
    </div>
  );
};

EnsemblStats.propTypes = {
  genes_total: PropTypes.number.isRequired,
  genes_unmapped: PropTypes.number.isRequired,
  transcripts_total: PropTypes.number.isRequired,
  transcripts_unmapped: PropTypes.number.isRequired,
  ensembl: PropTypes.number.isRequired,
};

export default EnsemblStats;
