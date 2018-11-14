import React from 'react';
import { Link } from 'react-router-dom';

import ReviewStatus from './ReviewStatus';
import StatusIndicator from './StatusIndicator';
import AlignmentIndicator from './alignment/AlignmentIndicator';
import Position from './Position';

const RelatedMapping = props => (
  <tr className="related-mapping">
    <td>
      <StatusIndicator status={props.status} />
    </td>
    <td>
      <Link to={`${BASE_URL}/mapping/${props.id}`}>
        <span>
          <ReviewStatus entryType={props.entryType} />
          {props.uniprotAccession} (v
          {props.sequenceVersion})
        </span>
      </Link>
    </td>
    <td>
      {props.enstId} (v
      {props.enstVersion})
    </td>
    <td>{props.geneId}</td>
    <td>{props.geneName}</td>
    <td>
      <Position transcript={props.transcript} />
    </td>
    <td>
      <AlignmentIndicator difference={props.alignment_difference} />
    </td>
  </tr>
);

const RelatedMappingsSection = props => (
  <table className="related-mappings">
    <thead>
      <tr>
        <th />
        <th>Protein</th>
        <th>Transcript</th>
        <th>Gene ID</th>
        <th>Gene Name</th>
        <th>Position</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {props.mappings.mapped.map(item => (
        <RelatedMapping
          id={item.mappingId}
          enstId={item.ensemblTranscript.enstId}
          geneId={item.ensemblTranscript.ensgId}
          geneName={item.ensemblTranscript.ensgName}
          enstVersion={item.ensemblTranscript.enstVersion}
          sequenceVersion={item.uniprotEntry.sequenceVersion}
          uniprotAccession={item.uniprotEntry.uniprotAccession}
          entryType={item.uniprotEntry.entryType}
          status={item.status}
          alignment_difference={item.alignment_difference}
          transcript={item.ensemblTranscript}
          start={item.ensemblTranscript.seqRegionStart}
          end={item.ensemblTranscript.seqRegionEnd}
          active={props.active === item.mappingId}
          onChange={props.onChange}
          key={item.mappingId}
        />
      ))}
    </tbody>
  </table>
);

export default RelatedMappingsSection;
