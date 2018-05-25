import React from 'react';
import '../../styles/Status.css';

function getClassName(status) {
  switch (status) {
    case 'UNDER_REVIEW':
      return 'status status--under-review';
    case 'ACCEPTED':
      return 'status status--accepted';
    case 'REJECTED':
      return 'status status--rejected';
    default:
      return 'status status--unreviewed';
  }
}

function Status(props) {
  return <div className={getClassName(props.status)} />;
}

export default Status;
