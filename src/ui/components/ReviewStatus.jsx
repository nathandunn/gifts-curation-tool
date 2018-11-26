import React from 'react';

import '../../styles/ReviewStatus.css';

const ReviewStatus = (props) => {
  switch (props.entryType) {
    case 'Swiss-Prot isoform':
      return <span className="icon icon-generic protein-review-status protein-review-status--isoform-reviewed" data-icon="q" title="UniProt isoform reviewed" />;
    case 'Swiss-Prot':
      return <span className="icon icon-generic protein-review-status protein-review-status--reviewed" data-icon="q" title="UniProt reviewed" />;
    case 'TrEMBL':
      return <span className="icon icon-generic protein-review-status protein-review-status--unreviewd" data-icon="Q" title="TrEMBL unreviewed" />;
    case 'Ensembl':
      return <span className="icon icon-generic protein-review-status protein-review-status--ensembl-select" data-icon="q" title="Ensembl select" />;
    default:
      // probably an isoform
      return null;
  }
};

export default ReviewStatus;
