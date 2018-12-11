import React from 'react';
import PropTypes from 'prop-types';

import { formatLargeNumber } from '../../util/util';
import DoughnutChart from './DoughnutChart';

const EnsemblStats = (props) => {
  const color = '#336';
  const genesMapped = props.genes_total - props.genes_unmapped;
  const transcriptsMapped = props.transcripts_total - props.transcripts_unmapped;

  return (
    <div className="column medium-6">
      <h3 style={{ color }} className="column medium-12">
        Ensembl <small>{props.ensembl}</small>
      </h3>
      <div className="stats-item column medium-6">
        <h5>Genes Mapped</h5>
        <DoughnutChart
          color={color}
          percent={Math.floor((genesMapped / props.genes_total) * 100)}
        />
        <span className="stat">{genesMapped ? formatLargeNumber(genesMapped) : 'NA'}</span>
      </div>
      <div className="stats-item column medium-6 end">
        <h5>Transcripts Mapped</h5>
        <DoughnutChart
          color={color}
          percent={Math.floor((transcriptsMapped / props.transcripts_total) * 100)}
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
