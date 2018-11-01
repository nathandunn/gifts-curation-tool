import React, { Fragment } from 'react';
import { formatLargeNumber } from '../util/util';

const Position = (props) => {
  const { transcript } = props;
  let position;
  if (transcript.chromosome && transcript.chromosome.length > 0) {
    position = `${transcript.chromosome}:${formatLargeNumber(+transcript.seqRegionStart)}-
      ${formatLargeNumber(+transcript.seqRegionEnd)}`;
  } else {
    position = transcript.ensgRegionAccession;
  }

  return <Fragment>{position}</Fragment>;
};

export default Position;
