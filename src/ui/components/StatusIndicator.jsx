import React from 'react';
import '../../styles/StatusIndicator.css';

function getClassName(status) {
  switch (status) {
    case 'UNDER_REVIEW':
      return 'status status--under-review';
    case 'REVIEWED':
      return 'status status--reviewed';
    case 'REJECTED':
      return 'status status--rejected';
    default:
      return 'status status--unreviewed';
  }
}

const StatusIndicator = props => <div className={getClassName(props.status)} />;

export default StatusIndicator;
