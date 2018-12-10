import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Arrow from './Arrow';
import ReviewStatus from './ReviewStatus';
import Position from './Position';

import '../../styles/MappingHeader.css';

const MappingHeader = (props) => {
  const { mapping, taxonomy } = props;

  return (
    <div className="mapping-header">
      <div className="mapping-ids">
        <h2>
          <Link to={`//www.ensembl.org/id/${mapping.ensemblTranscript.enstId}`} target="_blank">
            <ReviewStatus entryType={mapping.ensemblTranscript.select ? 'Ensembl' : ''} />

            {mapping.ensemblTranscript.enstId}
          </Link>
        </h2>
        <div>
          <strong>Release:</strong> {mapping.ensemblRelease}
        </div>
        <div>
          <strong>Symbol:</strong> {mapping.ensemblTranscript.ensgSymbol}
        </div>
        <div>
          <strong>Gene Id:</strong>
          &nbsp;
          <Link to={`//www.ensembl.org/id/${mapping.ensemblTranscript.ensgId}`} target="_blank">
            {mapping.ensemblTranscript.ensgId}
          </Link>
        </div>
        <div>
          <strong>Description:</strong> {mapping.ensemblTranscript.ensgName}
        </div>
        <div>
          <strong>Position:</strong> <Position transcript={mapping.ensemblTranscript} />
        </div>
        <div>
          <strong>Biotype:</strong> {mapping.ensemblTranscript.biotype}
        </div>
        <div>
          <strong>Region:</strong> {mapping.ensemblTranscript.regionAccession}
        </div>
        <div>
          <strong>Source:</strong> {mapping.ensemblTranscript.source}
        </div>
      </div>
      <Arrow />
      <div className="mapping-ids">
        <h2>
          <Link
            to={`//www.uniprot.org/uniprot/${mapping.uniprotEntry.uniprotAccession}`}
            target="_blank"
          >
            <ReviewStatus entryType={mapping.uniprotEntry.entryType} />

            {mapping.uniprotEntry.uniprotAccession}
          </Link>
        </h2>
        <div>
          <strong>Release:</strong> {mapping.uniprotRelease}
        </div>
        <div>
          <strong>Canonical:</strong> {mapping.uniprotEntry.isCanonical ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Length</strong> {mapping.uniprotEntry.length}
        </div>
        <div>
          <strong>Ensembl derived:</strong> {mapping.uniprotEntry.ensemblDerived ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default MappingHeader;
