import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ProteinReviewStatus from './ProteinReviewStatus';
import Arrow from './Arrow';
import StatusIndicator from './StatusIndicator';
import AlignmentIndicator from './AlignmentIndicator';

const RelatedMapping = props => (
  <div className="related-mapping">
    <StatusIndicator status={props.status} />
    <Link to={`/mapping/${props.id}`}>
      <span>
        <ProteinReviewStatus entryType={props.entryType}/>{props.uniprotAccession}
      </span>
      <Arrow />
      <span>{props.enstId}</span>
      <AlignmentIndicator difference={props.alignment_difference} />
    </Link>
  </div>
);

const RelatedMappingsSection = props => (
  <div className="related-mappings">
    {props.mappings.map(item => (<RelatedMapping
      id={item.mappingId}
      enstId={item.ensemblTranscript.enstId}
      uniprotAccession={item.uniprotEntry.uniprotAccession}
      entryType={item.uniprotEntry.entryType}
      status={item.status}
      alignment_difference={item.alignment_difference}
      key={item.mappingId}
    />))}
  </div>
);

export default RelatedMappingsSection;
