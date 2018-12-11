import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { formatLargeNumber } from '../util/util';

const Position = (props) => {
  const { transcript } = props;
  let position;
  if (transcript.chromosome && transcript.chromosome.length > 0) {
    position = `${transcript.chromosome}:${formatLargeNumber(+transcript.seqRegionStart)}-${formatLargeNumber(+transcript.seqRegionEnd)}`;
  } else {
    position = transcript.ensgRegionAccession;
  }

  return <Fragment>{position}</Fragment>;
};

Position.propTypes = {
  transcript: PropTypes.object.isRequired,
};

export default Position;
