import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Arrow from './Arrow';
import ProteinReviewStatus from './ProteinReviewStatus';

import '../../styles/MappingHeader.css';

const MappingHeader = (props) => {
  const { mapping, taxonomy } = props;

  return (
    <div className="mapping-header">
      <div className="mapping-ids">
        <h2>
          <Link to={`//www.ensembl.org/id/${mapping.ensemblTranscript.enstId}`} target="_blank">
            {mapping.ensemblTranscript.enstId}
          </Link>
        </h2>
        <div>
          <strong>Release:</strong> {mapping.ensemblRelease}
        </div>
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
          <strong>Release:</strong> {mapping.uniprotRelease}
        </div>
        <div>
          <strong>Canonical:</strong> {mapping.uniprotEntry.isCanonical ? 'Yes' : 'No'}
        </div>
        {taxonomy.uniprotTaxId === 9606 && (
          <div>
            <strong>HGNC:</strong> {mapping.uniprotEntry.gene_symbol}
          </div>
        )}
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
