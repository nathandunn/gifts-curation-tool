import React from 'react';
import { formatLargeNumber } from '../util/util';

const EnsemblStats = props => {
  const { geneMapped, geneNotMapped, transMapped } = props;
  return (
    <div className="row">
      <div className="column medium-4">
        <h5>Ensembl Gene Mapped</h5>
        <span className="stat">{geneMapped ? formatLargeNumber(geneMapped) : 'NA'}</span>
      </div>
      <div className="column medium-4">
        <h5>Ensembl Gene Not Mapped (SP)</h5>
        <span className="stat">{geneNotMapped ? formatLargeNumber(geneNotMapped) : 'NA'}</span>
      </div>
      <div className="column medium-4">
        <h5>Transcript Mapped</h5>
        <span className="stat">{transMapped ? formatLargeNumber(transMapped) : 'NA'}</span>
      </div>
    </div>
  );
}

export default EnsemblStats;
