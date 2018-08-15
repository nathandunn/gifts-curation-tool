import React, { Fragment } from 'react';

import StatusIndicator from './StatusIndicator';
import StatusChangeControl from './StatusChangeControl';

const StatusSection = props => {
  const { status, onChange, isLoggedIn, mappingId } = props;
  const statusOptions = {
    NOT_REVIEWED: 'Not Reviewed',
    UNDER_REVIEW: 'Under Review',
    REVIEWED: 'Reviewed',
    REJECTED: 'Rejected',
  }

  return (
    <Fragment>
      <StatusIndicator status={status} />
      {(isLoggedIn)
        ? <StatusChangeControl
            mappingId={mappingId}
            status={status}
            options={statusOptions}
            onChange={onChange}
          />
        : <span id="status-indicator">{statusOptions[status]}</span>
      }
    </Fragment>
  );
}

export default StatusSection;
