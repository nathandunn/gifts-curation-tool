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
      <StatusIndicator status={props.status} />
    </td>
    <td>
      <ReviewStatus entryType={props.uniprotEntry.entryType} />
      <a href={`//www.uniprot.org/uniprot/${props.uniprotEntry.uniprotAccession}`} target="_blank">
        {props.uniprotEntry.uniprotAccession}
      </a>
    </td>
    <td>
      <a href={`//www.ensembl.org/id/${props.ensemblTranscript.enstId}`} target="_blank">
        {props.ensemblTranscript.enstId}
      </a>
    </td>
    <td>
      <a href={`//www.ensembl.org/id/${props.ensemblTranscript.ensgId}`} target="_blank">
        {props.ensemblTranscript.ensgId}
      </a>
    </td>
    <td>{props.ensemblTranscript.ensgName}</td>
    <td>{props.ensemblTranscript.source}</td>
    <td>
      <Position transcript={props.ensemblTranscript} />
    </td>
    <td>
      <AlignmentIndicator difference={props.alignment_difference} />
    </td>
    <td>
      <Link to={`${BASE_URL}/mapping/${props.mappingId}`}>
        <span>View</span>
      </Link>
    </td>
  </tr>);

RelatedMapping.propTypes = {
  // item: PropTypes.shape({
  //   status: PropTypes.string,
  //   id: PropTypes.string,
  //   ensemblTranscript: PropTypes.object,
  //   uniprotEntry: PropTypes.object,
  //   alignment_difference: PropTypes.number,
  // }).isRequired,
  status: PropTypes.string.isRequired,
  uniprotEntry: PropTypes.object.isRequired,
  ensemblTranscript: PropTypes.object.isRequired,
  alignment_difference: PropTypes.number,
  mappingId: PropTypes.number.isRequired,
};

RelatedMapping.defaultProps = {
  alignment_difference: null,
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

const UnmappedUniProt = (props) => {
  return (
    <tr className="related-mapping">
      <td />
      <td>
        <a href={`//www.uniprot.org/uniprot/${props.uniprotAccession}`} target="_blank">
          <span>
            <ReviewStatus entryType={props.entryType} />
            {props.uniprotAccession}
          </span>
        </a>
      </td>
      <td />
      <td>{props.gene_accession}</td>
      <td>{props.gene_symbol}</td>
      <td />
      <td />
      <td />
    </tr>
  );
};

UnmappedUniProt.propTypes = {
  // item: PropTypes.shape({
  //   gene_accession: PropTypes.string,
  //   gene_symbol: PropTypes.string,
  //   uniprotAccession: PropTypes.string,
  //   entryType: PropTypes.string,
  // }).isRequired,
  uniprotAccession: PropTypes.string.isRequired,
  entryType: PropTypes.string.isRequired,
  gene_accession: PropTypes.string,
  gene_symbol: PropTypes.string,
};

UnmappedUniProt.defaultProps = {
  gene_accession: '',
  gene_symbol: '',
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
        <RelatedMapping item={item} key={item.mappingId} />
      ))}
      {props.mappings.unmapped.ensembl.map(item => (
        <UnmappedEnsembl item={item} key={`${item.enstId}-${item.ensgId}`} />
      ))}
      {props.mappings.unmapped.uniprot.map(item => (
        <UnmappedUniProt item={item} key={`${item.gene_symbol}-${item.uniprotAccession}`} />
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
