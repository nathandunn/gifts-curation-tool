import React from 'react';
import PropTypes from 'prop-types';

import { formatLargeNumber } from '../../util/util';
import DoughnutChart from './DoughnutChart';

const UniProtStats = (props) => {
  const {
    uniprot_entries_total,
    uniprot_entries_unmapped,
    uniprot_entries_unmapped_sp,
    uniprot,

  } = props;
  const mapped = uniprot_entries_total - uniprot_entries_unmapped;
  const color = '#00709b';
  const swissProtUnmapped = Math.floor(
    (uniprot_entries_unmapped_sp / uniprot_entries_total) * 100,
  );
  return (
    <div className="column medium-6">
      <h3 style={{ color }} className="column medium-12">
        UniProt&nbsp;
        <small>{uniprot}</small>
      </h3>
      <div className="stats-item column medium-6">
        <h5>UniProtKB Canonical & Isoforms Mapped</h5>
        <DoughnutChart
          color={color}
          percent={Math.floor((mapped / uniprot_entries_total) * 100)}
        />
        <span className="stat">{mapped ? formatLargeNumber(mapped) : 'NA'}</span>
      </div>
      <div className="stats-item  column medium-6">
        <h5>Swiss-Prot Canonical Unmapped</h5>
        <DoughnutChart
          percent={swissProtUnmapped}
        />
        <span className="stat">
          {uniprot_entries_unmapped_sp
            ? formatLargeNumber(uniprot_entries_unmapped_sp)
            : 'NA'}
        </span>
      </div>
    </div>
  );
};

UniProtStats.propTypes = {
  uniprot_entries_total: PropTypes.number,
  uniprot_entries_unmapped: PropTypes.number,
  uniprot: PropTypes.string,
  uniprot_entries_unmapped_sp: PropTypes.number,
};

UniProtStats.defaultProps = {
  uniprot_entries_total: null,
  uniprot_entries_unmapped: null,
  uniprot: '',
  uniprot_entries_unmapped_sp: null,
};

export default UniProtStats;
