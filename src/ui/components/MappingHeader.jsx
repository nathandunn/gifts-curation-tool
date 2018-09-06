import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Arrow from './Arrow';
import ProteinReviewStatus from './ProteinReviewStatus';

import '../../styles/MappingHeader.css';

const MappingHeader = (props) => {
  const { mapping } = props;

  return (
    <div className="mapping-header">
      <div className="mapping-ids">
        <h2>
          <Link to={`//www.ensembl.org/id/${mapping.ensemblTranscript.enstId}`} target="_blank">
            {mapping.ensemblTranscript.enstId}
          </Link>
        </h2>
        <div>
          <strong>Gene Id:</strong>
          &nbsp;<Link
            to={`//www.ensembl.org/id/${mapping.ensemblTranscript.ensgId}`}
            target="_blank"
          >
            {mapping.ensemblTranscript.ensgId}
          </Link>
        </div>
        <div>
          <strong>Gene:</strong> {mapping.ensemblTranscript.ensgName}
        </div>
        <div>
          <strong>Position:</strong> {mapping.ensemblTranscript.chromosome}:{
            mapping.ensemblTranscript.seqRegionStart
          }-{mapping.ensemblTranscript.seqRegionEnd}
        </div>
        <div>
          <strong>Biotype:</strong> {mapping.ensemblTranscript.biotype}
        </div>
        <div>
          <strong>ENST version:</strong> {mapping.ensemblTranscript.enstVersion}
        </div>
      </div>
      <Arrow />
      <div className="mapping-ids">
        <h2>
          <Link
            to={`//www.uniprot.org/uniprot/${mapping.uniprotEntry.uniprotAccession}`}
            target="_blank"
          >
            <ProteinReviewStatus entryType={mapping.uniprotEntry.entryType} />

            {mapping.uniprotEntry.uniprotAccession}
          </Link>
        </h2>
        <div>
          <strong>Canonical:</strong> {mapping.uniprotEntry.isCanonical ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Ensembl derived:</strong> {mapping.uniprotEntry.ensemblDerived ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Sequence version:</strong> {mapping.uniprotEntry.sequenceVersion}
        </div>
      </div>
    </div>
  );
};

export default MappingHeader;
