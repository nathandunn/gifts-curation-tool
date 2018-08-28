import React from 'react';
import { formatLargeNumber } from '../util/util';

const UniProtStats = props => {
  const { mapped, notMapped } = props;
  return (
    <div className="row">
      <div className="column medium-6">
        <h4>UniProt Mapped</h4>
        <span className="stat">{mapped ? formatLargeNumber(mapped) : 'NA'}</span>
      </div>
      <div className="column medium-6">
        <h4>UniProt Not Mapped (Swiss-Prot)</h4>
        <span className="stat">{notMapped ? formatLargeNumber(notMapped) : 'NA'}</span>
      </div>
    </div>
  );
}

export default UniProtStats;
