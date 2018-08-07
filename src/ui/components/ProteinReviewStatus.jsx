import React from 'react';

const ProteinReviewStatus = (props) => {
  switch (props.entryType) {
    case 'Swiss-Prot isoform':
      return <span className="icon icon-generic" data-icon="q" title="UniProt isoform reviewed" />;
    case 'Swiss-Prot':
      return <span className="icon icon-generic" data-icon="q" title="UniProt reviewed" />;
    case 'TrEMBL':
      return <span className="icon icon-generic" data-icon="Q" title="TrEMBL unreviewed" />;
    default:
      // probably an isoform
      return null;
  }
};

export default ProteinReviewStatus;
