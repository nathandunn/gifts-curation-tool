import React, { Fragment } from 'react';
import { formatLargeNumber } from '../util/util';

const TotalMappingsStats = props => (
  <Fragment>
    <h3>Total mappings</h3>
    <span className="stat">
      {props.total ? formatLargeNumber(props.total) : 0}
    </span>
  </Fragment>
);

export default TotalMappingsStats;
