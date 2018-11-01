import React, { Fragment } from 'react';
import { formatLargeNumber } from '../util/util';
import DoughnutChart from './DoughnutChart';

const UniProtStats = (props) => {
  const mapped = props.uniprot_entries_total - props.uniprot_entries_unmapped;
  const { notMapped, total } = props;
  const color = '#00709b';
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
          percent={Math.floor((props.uniprot_entries_unmapped_sp / props.uniprot_entries_total) * 100)}
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

export default UniProtStats;
