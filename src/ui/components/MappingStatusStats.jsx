import React from 'react';
import StatusIndicator from '../components/StatusIndicator';

import DoughnutChart from './DoughnutChart';

import { formatStatusName, formatLargeNumber } from '../util/util';

const getStatusColor = (status) => {
  switch (status) {
    case 'UNDER_REVIEW':
      return 'blue';
    case 'REVIEWED':
      return 'green';
    case 'REJECTED':
      return 'red';
    default:
      return 'grey';
  }
};

const MappingStatusStats = (props) => {
  const { stats, total } = props;

  if (stats === null || typeof stats === 'undefined') {
    return null;
  }

  return (
    <div className="text-center">
      <h2>Status</h2>
      {stats.map((statusCount, index) => (
        <div key={`status-${index}`} className="stats-item">
          <h5>{formatStatusName(statusCount.status)}</h5>
          <DoughnutChart
            color={getStatusColor(statusCount.status)}
            percent={((statusCount.count / total) * 100).toFixed(4)}
          />
          <span className="stat">{formatLargeNumber(statusCount.count)}</span>
        </div>
      ))}
    </div>
  );
};

export default MappingStatusStats;
