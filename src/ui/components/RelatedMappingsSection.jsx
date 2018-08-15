import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ProteinReviewStatus from './ProteinReviewStatus';
import Arrow from './Arrow';

const RelatedMapping = props => (
  <div className="related-mapping">
    <Link to={`/mapping/${props.id}`}>
      <span>{props.enstId}</span>
      <Arrow />
      <span>
        <ProteinReviewStatus entryType={props.entryType}/>{props.uniprotAccession}
      </span>
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
      key={item.mappingId}
    />))}
  </div>
);

export default RelatedMappingsSection;
