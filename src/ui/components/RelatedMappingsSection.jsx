import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ReviewStatus from './ReviewStatus';
import StatusIndicator from './StatusIndicator';
import AlignmentIndicator from './alignment/AlignmentIndicator';
import Position from './Position';

const RelatedMapping = (props) => {
  const {
    status, mappingId, ensemblTranscript, uniprotEntry, alignment_difference,
  } = props.item;

  return (
    <tr className="related-mapping">
      <td>
        <StatusIndicator status={status} />
      </td>
      <td>
        <ReviewStatus entryType={uniprotEntry.entryType} />
        <a href={`//www.uniprot.org/uniprot/${uniprotEntry.uniprotAccession}`} target="_blank">
          {uniprotEntry.uniprotAccession}
        </a>
      </td>
      <td>
        <a href={`//www.ensembl.org/id/${ensemblTranscript.enstId}`} target="_blank">
          {ensemblTranscript.enstId}
        </a>
      </td>
      <td>
        <a href={`//www.ensembl.org/id/${ensemblTranscript.ensgId}`} target="_blank">
          {ensemblTranscript.ensgId}
        </a>
      </td>
      <td>{ensemblTranscript.ensgName}</td>
      <td>
        <Position transcript={ensemblTranscript} />
      </td>
      <td>
        <AlignmentIndicator difference={alignment_difference} />
      </td>
      <td>
        <Link to={`${BASE_URL}/mapping/${mappingId}`}>
          <span>View</span>
        </Link>
      </td>
    </tr>
  );
};

RelatedMapping.propTypes = {
  item: PropTypes.shape({
    status: PropTypes.string,
    id: PropTypes.string,
    ensemblTranscript: PropTypes.object,
    uniprotEntry: PropTypes.object,
    alignment_difference: PropTypes.number,
  }).isRequired,
};

const Unmapped = (props) => {
  const {
    gene_accession, gene_symbol, uniprotAccession, entryType,
  } = props.item;
  return (
    <tr className="related-mapping">
      <td />
      <td>
        <a href={`//www.uniprot.org/uniprot/${uniprotAccession}`} target="_blank">
          <span>
            <ReviewStatus entryType={entryType} />
            {uniprotAccession}
          </span>
        </a>
      </td>
      <td />
      <td>{gene_accession}</td>
      <td>{gene_symbol}</td>
      <td />
      <td />
      <td />
    </tr>
  );
};

Unmapped.propTypes = {
  item: PropTypes.shape({
    gene_accession: PropTypes.string,
    gene_symbol: PropTypes.string,
    uniprotAccession: PropTypes.string,
    entryType: PropTypes.string,
  }).isRequired,
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
        <th>Position</th>
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      {props.mappings.mapped.map(item => (
        <RelatedMapping item={item} key={item.mappingId} />
      ))}
      {props.mappings.unmapped.map(item => (
        <Unmapped item={item} key={`${item.gene_symbol}${item.uniprotAccession}`} />
      ))}
    </tbody>
  </table>
);

RelatedMappingsSection.propTypes = {
  mappings: PropTypes.shape({
    mapped: PropTypes.array,
    unmapped: PropTypes.array,
  }).isRequired,
};

export default RelatedMappingsSection;
