import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Arrow from './Arrow';

import '../../styles/MappingIds.css';

const MappingIds = props => {
  const {
    enstId,
    enstVersion,
    uniprotAccession,
    sequenceVersion,
    geneName,
  } = props;

  return (
    <div className="mapping-ids">
      <span className="mapping-ids__id">
        {geneName}
      </span>
      <Arrow />
      <span className="mapping-ids__id">
        <Link to={`//www.ensembl.org/id/${enstId}`} target="_blank">{`${enstId} (v${enstVersion})`}</Link>
      </span>
      <Arrow />
      <span className="mapping-ids__id">
        <Link to={`//www.uniprot.org/uniprot/${uniprotAccession}`} target="_blank">{`${uniprotAccession} (v${sequenceVersion})`}</Link>
      </span>
    </div>
  );
}

export default MappingIds;
