import React from 'react';
import PropTypes from 'prop-types';

import { formatLargeNumber } from '../../util/util';
import DoughnutChart from './DoughnutChart';

const UniProtStats = (props) => {
  const mapped = props.uniprot_entries_total - props.uniprot_entries_unmapped;
  const color = '#00709b';
  const swissProtUnmapped =
    Math.floor((props.uniprot_entries_unmapped_sp / props.uniprot_entries_total) * 100);
  return (
    <div className="column medium-6">
      <h3 style={{ color }} className="column medium-12">
        UniProt <small>{props.uniprot}</small>
      </h3>
      <div className="stats-item column medium-6">
        <h5>Mapped</h5>
        <DoughnutChart
          color={color}
          percent={Math.floor((mapped / props.uniprot_entries_total) * 100)}
        />
        <span className="stat">{mapped ? formatLargeNumber(mapped) : 'NA'}</span>
      </div>
      <div className="stats-item  column medium-6">
        <h5>Swiss-Prot unmapped</h5>
        <DoughnutChart
          percent={swissProtUnmapped}
        />
        <span className="stat">
          {props.uniprot_entries_unmapped_sp
            ? formatLargeNumber(props.uniprot_entries_unmapped_sp)
            : 'NA'}
        </span>
      </div>
    </div>
  );
};

UniProtStats.propTypes = {
  uniprot_entries_total: PropTypes.number,
  uniprot_entries_unmapped: PropTypes.number,
  uniprot: PropTypes.number,
  uniprot_entries_unmapped_sp: PropTypes.number,
};

UniProtStats.defaultProps = {
  uniprot_entries_total: null,
  uniprot_entries_unmapped: null,
  uniprot: null,
  uniprot_entries_unmapped_sp: null,
};

export default UniProtStats;
