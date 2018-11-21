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
    case 'UNIPROT_REVIEW':
      return 'status status--uniprot';
    case 'ENSEMBL_REVIEW':
      return 'status status--ensembl';
    case 'REFSEQ_REVIEW':
      return 'status status--refseq';
    case 'HGNC_REVIEW':
      return 'status status--hgnc';
    default:
      return 'status status--unreviewed';
  }
}

const StatusIndicator = props => <div className={getClassName(props.status)} />;

export default StatusIndicator;
