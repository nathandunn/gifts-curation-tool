import React, { Fragment } from 'react';
import { formatLargeNumber } from '../util/util';
import DoughnutChart from './DoughnutChart';

const UniProtStats = (props) => {
  const { mapped, notMapped, total } = props;
  const color = '#00709b';
  return (
    <div className="text-center">
      <h2 style={{ color }}>UniProt</h2>
      <div className="stats-item">
        <h5>Mapped</h5>
        <DoughnutChart color={color} percent={Math.floor((mapped / total) * 100)} />
        <span className="stat">{mapped ? formatLargeNumber(mapped) : 'NA'}</span>
      </div>
      <div className="stats-item">
        <h5>Not Mapped (Swiss-Prot)</h5>
        <DoughnutChart percent={Math.floor((notMapped / total) * 100)} />
        <span className="stat">{notMapped ? formatLargeNumber(notMapped) : 'NA'}</span>
      </div>
    </div>
  );
};

export default UniProtStats;
