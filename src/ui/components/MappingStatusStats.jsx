import React, { Fragment } from 'react';
import StatusIndicator from '../components/StatusIndicator';
import { formatStatusName, formatLargeNumber } from '../util/util';

const MappingStatusStats = props => {
  const { stats } = props;

  if (null === stats || 'undefined' === typeof stats) {
    return null;
  }

  return (
    <Fragment>
      {stats.map((statusCount, index) => (
        <div key={`status-${index}`} className="column medium-3">
          <h4>{formatStatusName(statusCount.status)}</h4>
          <span className="stat">
            <StatusIndicator status={statusCount.status} />
            {formatLargeNumber(statusCount.count)}
          </span>
        </div>
        ))}
    </Fragment>
  );
}

export default MappingStatusStats;
