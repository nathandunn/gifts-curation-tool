import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ReviewStatus from './ReviewStatus';
import StatusIndicator from './StatusIndicator';
import AlignmentIndicator from './alignment/AlignmentIndicator';
import Position from './Position';

const RelatedMapping = props => (
  <tr className="related-mapping">
    <td>
      <StatusIndicator status={props.item.status} />
    </td>
    <td>
      <ReviewStatus entryType={props.item.uniprotEntry.entryType} />
      <a href={`//www.uniprot.org/uniprot/${props.item.uniprotEntry.uniprotAccession}`} target="_blank">
        {props.item.uniprotEntry.uniprotAccession}
      </a>
    </td>
    <td>
      <a href={`//www.ensembl.org/id/${props.item.ensemblTranscript.enstId}`} target="_blank">
        {props.item.ensemblTranscript.enstId}
      </a>
    </td>
    <td>
      <a href={`//www.ensembl.org/id/${props.item.ensemblTranscript.ensgId}`} target="_blank">
        {props.item.ensemblTranscript.ensgId}
      </a>
    </td>
    <td>{props.item.ensemblTranscript.ensgName}</td>
    <td>{props.item.ensemblTranscript.source}</td>
    <td>
      <Position transcript={props.item.ensemblTranscript} />
    </td>
    <td>
      <AlignmentIndicator difference={props.item.alignment_difference} />
    </td>
    <td>
      <Link to={`${BASE_URL}/mapping/${props.item.mappingId}`}>
        <span>View</span>
      </Link>
    </td>
  </tr>
);

RelatedMapping.propTypes = {
  item: PropTypes.shape({
    mappingId: PropTypes.number,
    status: PropTypes.string,
    uniprotEntry: PropTypes.object,
    ensemblTranscript: PropTypes.object,
    alignment_difference: PropTypes.number,
  }).isRequired,
};

const UnmappedEnsembl = (props) => {
  const {
    enstId,
    ensgId,
    ensgName,
    source,
    chromosome,
    seqRegionStart,
    seqRegionEnd,
  } = props.item;
  return (
    <tr className="related-mapping">
      <td />
      <td />
      <td>{enstId}</td>
      <td>{ensgId}</td>
      <td>{ensgName}</td>
      <td>{source}</td>
      <td><Position transcript={{ chromosome, seqRegionStart, seqRegionEnd }} /></td>
      <td />
      <td />
    </tr>
  );
};

UnmappedEnsembl.propTypes = {
  item: PropTypes.shape({
    enstId: PropTypes.string,
    ensgId: PropTypes.string,
    ensgName: PropTypes.string,
    source: PropTypes.string,
    chromosome: PropTypes.string,
    seqRegionStart: PropTypes.number,
    seqRegionEnd: PropTypes.number,
  }).isRequired,
};

const UnmappedUniProt = props => (
  <tr className="related-mapping">
    <td />
    <td>
      <a href={`//www.uniprot.org/uniprot/${props.item.uniprotAccession}`} target="_blank">
        <span>
          <ReviewStatus entryType={props.item.entryType} />
          {props.item.uniprotAccession}
        </span>
      </a>
    </td>
    <td />
    <td>{props.item.gene_accession}</td>
    <td>{props.item.gene_symbol}</td>
    <td />
    <td />
    <td />
  </tr>
);

UnmappedUniProt.propTypes = {
  item: PropTypes.shape({
    uniprotAccession: PropTypes.string.isRequired,
    entryType: PropTypes.string.isRequired,
    gene_accession: PropTypes.string,
    gene_symbol: PropTypes.string,
  })
};

UnmappedUniProt.defaultProps = {
  gene_accession: null,
  gene_symbol: null,
};

const RelatedMappingsSection = props => (
  <table className="related-mappings">
    <thead>
      <tr>
        <th />
        <th>Protein</th>
        <th>Transcript</th>
        <th>Gene ID</th>
        <th>Gene Name</th>
        <th>Source</th>
        <th>Position</th>
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      {props.mappings.mapped.map(item => (
        (item)
          ? <RelatedMapping item={item} key={item.mappingId} />
          : null
      ))}
      {props.mappings.unmapped.ensembl.map(item => (
        (item)
          ? <UnmappedEnsembl item={item} key={`${item.enstId}-${item.ensgId}`} />
          : null
      ))}
      {props.mappings.unmapped.uniprot.map(item => (
        (item)
          ? <UnmappedUniProt item={item} key={`${item.gene_symbol}-${item.uniprotAccession}`} />
          : null
      ))}
    </tbody>
  </table>
);

RelatedMappingsSection.propTypes = {
  mappings: PropTypes.shape({
    mapped: PropTypes.array,
    unmapped: PropTypes.object,
  }).isRequired,
};

export default RelatedMappingsSection;
