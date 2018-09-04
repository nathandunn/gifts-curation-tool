import React from 'react';
import { formatLargeNumber } from '../util/util';

import DoughnutChart from './DoughnutChart';

const EnsemblStats = (props) => {
  const {
    geneMapped, geneNotMapped, transMapped, total,
  } = props;
  const color = '#336';
  const totalGeneCount = geneMapped + geneNotMapped;
  return (
    <div className="text-center">
      <h2 style={{ color }}>Ensembl</h2>
      <div className="stats-item">
        <h5>Genes Mapped</h5>
        <DoughnutChart color={color} percent={Math.floor((geneMapped / totalGeneCount) * 100)} />
        <span className="stat">{geneMapped ? formatLargeNumber(geneMapped) : 'NA'}</span>
      </div>
      <div className="stats-item">
        <h5>Genes Not Mapped (SP)</h5>
        <DoughnutChart color={color} percent={Math.floor((geneNotMapped / totalGeneCount) * 100)} />
        <span className="stat">{geneNotMapped ? formatLargeNumber(geneNotMapped) : 'NA'}</span>
      </div>
      <div className="stats-item">
        <h5>Transcripts Mapped</h5>
        <DoughnutChart color={color} percent={Math.floor((transMapped / total) * 100)} />
        <span className="stat">{transMapped ? formatLargeNumber(transMapped) : 'NA'}</span>
      </div>
    </div>
  );
};

export default EnsemblStats;
